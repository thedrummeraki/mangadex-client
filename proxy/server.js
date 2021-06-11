var express = require("express"),
  request = require("request"),
  geoip = require("geoip-lite"),
  axios = require("axios"),
  fs = require("fs"),
  app = express();

const log = require("./logger");
const yaml = require("js-yaml");
const Vibrant = require("node-vibrant");

const {
  cacheMiddleware,
  cacheResponseBody,
  cacheAnything,
  cacheKey,
} = require("./middleware/cache");

const port = process.env.PORT || 3001;

const parseIp = (req) =>
  (typeof req.headers["x-forwarded-for"] === "string" &&
    req.headers["x-forwarded-for"].split(",").shift()) ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  req.connection.socket.remoteAddress;

const getCountryInfo = (req) => {
  const ip = parseIp(req);
  if (ip) {
    const geo = geoip.lookup(ip);
    if (geo) {
      const continentRegex = RegExp(/(\w+)\/\w+/);
      return {
        country: geo.country,
        continent: geo.timezone.match(continentRegex)[1],
        timezone: geo.timezone,
      };
    }
  }

  return { country: null, timezone: null };
};

// Check for env variables
missingEnvs = [];
["TARGET_URL", "ORIGIN_URL"].forEach((env_var) => {
  if (!process.env[env_var]) {
    missingEnvs.push(env_var);
  }
});

if (missingEnvs.length > 0) {
  log.error(`Missing environment variables: ${missingEnvs.join(", ")}`);
  process.exit(1);
}

const targetURL = process.env.TARGET_URL;
var originURLs = process.env.ORIGIN_URL;

if (originURLs === "*") {
  log.error("Origin URL cannot be *");
  process.exit(1);
}

originURLs = originURLs.split(",").map((url) => url.trim());
log.info("Allowing origin URLs:");
originURLs.forEach((url) => {
  console.log("\t ->", url);
});

const getOriginURL = (req) => {
  const originatingHost = req.headers["origin"];
  const goingToHost = req.headers["host"];
  const currentHostname = req.hostname;

  if (originatingHost) {
    log.debug("Request originating from", `"${originatingHost}"`);
  }

  if (goingToHost) {
    log.debug("Request going to host", `"${goingToHost}"`);
  }

  const host = originatingHost || goingToHost || currentHostname;

  const matchingOriginURL = originURLs.filter((authorized_urls) =>
    Boolean(host.match(RegExp(authorized_urls)))
  )[0];

  if (!matchingOriginURL) {
    log.warn("No matching origin URL was found...");
    return null;
  }

  return matchingOriginURL;
};

app.use(express.json());
app.use(log.basicExpressLogger);

var allowCrossDomain = function (req, res, next) {
  const allowedHeaders =
    req.header("access-control-request-headers") ||
    "Content-Type,X-Tanoshimu-Auth,X-Proxied-Auth-ID";

  const originatingHost = req.headers["origin"];
  const goingToHost = req.headers["host"];
  const currentHostname = req.hostname;

  if (originatingHost) {
    log.debug("Request originating from", `"${originatingHost}"`);
  }

  if (goingToHost) {
    log.debug("Request going to host", `"${goingToHost}"`);
  }

  const host = originatingHost || goingToHost || currentHostname;
  log.info("Coming from", host);

  // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
  const originURL = getOriginURL(req);
  if (originURL) {
    res.header("Access-Control-Allow-Origin", originURL);
  } else {
    log.warn(
      "Warning: Access-Control-Allow-Origin not authorized for host",
      `"${host}"`
    );
  }

  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header("Access-Control-Allow-Headers", allowedHeaders);
  res.header("X-Request-Id", req.headers["x-request-id"]);

  next();
};

app.use(allowCrossDomain);

app.use(cacheMiddleware);
// app.use(authenticateWithOAuthProvider);

app.get("/version", (req, res) => {
  request({ uri: "https://api.mangadex.org/api.yaml" }, (err, response) => {
    if (err) {
      res.send({ error: true });
    } else {
      res.send({ version: yaml.load(response.body).info.version });
    }
  });
});

app.get("/palette", (req, res) => {
  const imageUrl = req.query.imageUrl || req.body.imageUrl;
  console.log("imageUrl", imageUrl, req.query, req.body);

  if (imageUrl) {
    Vibrant.from(imageUrl)
      .getPalette()
      .then((palette) => {
        const { rgb } = palette.Vibrant;
        const hex = rgb.length >= 3 ? rgbToHex(rgb[0], rgb[1], rgb[2]) : null;

        log.debug("Color", rgb, hex);
        res.send({ success: true, color: hex, rgb });
      })
      .catch((err) => {
        console.log("error", err);
        res.send({ success: false });
      });
  } else {
    res.send({ success: false, reason: "missing imageUrl" });
  }
});

app.get("/at-home/img", async (req, res) => {
  const chapterId = req.query.chapterId;
  const page = parseInt(req.query.page);
  const dataServer = req.query.dataServer === "true";

  if (!chapterId || !chapterId.length) {
    return res.status(400).send({ error: true, message: "Missing chapter id" });
  }

  if (!page) {
    return res.status(400).send({ error: true, message: "Missing page" });
  }

  try {
    const { data: chapterData } = await axios.request({
      baseURL: "https://api.mangadex.org",
      method: "GET",
      url: `/chapter/${chapterId}`,
    });

    if (!chapterData || chapterData.result !== "ok") {
      return res.status(404).send({
        error: true,
        message: "Could not get chapter by id",
        id: chapterId,
        data: chapterData,
      });
    }

    const source = dataServer
      ? { chapter: "dataSaver", atHome: "data-saver" }
      : { chapter: "data", atHome: "data" };

    const chapterPageIds = chapterData.data.attributes[source.chapter];
    if (page - 1 < 0 || page - 1 >= chapterPageIds.length) {
      return res.status(400).send({
        error: true,
        message: "Page number out of bounds.",
        max: chapterPageIds.length,
      });
    }

    const { data: atHomeData } = await axios.request({
      baseURL: "https://api.mangadex.org",
      method: "GET",
      url: `/at-home/server/${chapterId}`,
    });

    console.log("data", atHomeData.baseUrl, `/chapter/${chapterId}`);

    if (!atHomeData.baseUrl) {
      return res
        .status(500)
        .send({ error: true, message: "Could not get at home server URL" });
    }

    const hash = chapterData.data.attributes.hash;
    const finalUrl = [
      atHomeData.baseUrl,
      source.atHome,
      hash,
      chapterPageIds[page],
    ].join("/");

    const extension = finalUrl.split(".").slice(-1);

    request.get(finalUrl, { encoding: "binary" }, (error, response) => {
      if (!error && response) {
        cacheAnything(req, response.body);
        res.writeHead(200, {
          "Content-Type": `image/png`,
          "Cache-Control": "max-age=300",
          "X-At-Home-Url": finalUrl,
        });
        res.end(response.body, "binary");
      }
    });
  } catch (error) {
    log.error(error.data);
    res.status(503).send({ error: true, message: "Unknown error" });
  }
});

app.get("/auth/check-and-refresh", async (req, res) => {
  const session = req.headers["x-auth-session"];
  const refresh = req.headers["x-auth-refresh"];

  if (session.length === 0 && refresh.length === 0) {
    return res
      .status(401)
      .send({ error: true, message: "No session or refresh token." });
  }

  if (session.length) {
    const bearerToken = session.trim();
    const { data: checkAuthData } = await axios.request({
      baseURL: "https://api.mangadex.org",
      method: "GET",
      url: "/auth/check",
      headers: {
        Authorization: bearerToken,
      },
    });

    if (checkAuthData.result !== "ok") {
      return res.status(400).send({
        error: true,
        message: "Could not check the validity of the token",
        bearerToken,
      });
    }

    try {
      const { data: getUserData } = await axios.request({
        baseURL: "https://api.mangadex.org",
        method: "GET",
        url: "/user/me",
        headers: {
          Authorization: bearerToken,
        },
      });

      if (getUserData.result === "ok") {
        return res.send({ ...getUserData });
      }
    } catch (e) {
      console.log("could not get user info", e.response.status);
    }
  }

  if (refresh.length) {
    try {
      const { data } = await axios.request({
        baseURL: "https://api.mangadex.org",
        method: "POST",
        url: "/auth/refresh",
        data: { token: refresh },
      });

      if (data.result === "ok") {
        const newSession = data.token.session;

        const { data: getUserData } = await axios.request({
          baseURL: "https://api.mangadex.org",
          method: "GET",
          url: "/user/me",
          headers: {
            Authorization: newSession,
          },
        });

        return res.send({ ...getUserData, ...data.token });
      }
    } catch (e) {
      console.log("could not refresh token", e.response.status);
    }
  }

  res.status(401).send({ error: true });
});

app.all("*", function (req, res, next) {
  log.info("Request coming from IP address", parseIp(req));

  const countryInfo = getCountryInfo(req);
  log.info(
    "Country: ",
    countryInfo.country,
    "Timezone: ",
    countryInfo.timezone
  );

  const originURL = getOriginURL(req);
  const authorizedToForward = Boolean(originURL && originURL.length > 0);

  const requestPath = `${targetURL}${req.url}`;

  if (req.method === "OPTIONS") {
    // CORS Preflight
    res.send();
  } else if (authorizedToForward) {
    const country = countryInfo.country;
    const timezone = countryInfo.timezone;
    const proxiedHeaders = {};
    if (country) {
      proxiedHeaders["X-Country"] = country;
    }
    if (timezone) {
      proxiedHeaders["X-Timezone"] = timezone;
    }
    proxyRequest(req, res, requestPath, proxiedHeaders);
  } else {
    console.log("\n\n");
    log.warn(
      `${req.method} ${requestPath} will not complete. Ending with 406 with generic message...`
    );
    res.status(406).json({
      error: true,
      message: "Not Acceptable",
      reason:
        "Some of the headers passed are not valid making this request invalid.",
      hint: "Did you check your CORS configuration?",
      host: req.headers["origin"] || req.hostname,
      requestPath,
    });
  }

  console.log("\n\n*********************");
});

app.set("port", port);

app.listen(app.get("port"), function () {
  log.info("Proxy server listening on port " + app.get("port"));
});

function proxyRequest(req, res, requestPath, proxiedHeaders) {
  const requestCacheKey = cacheKey(req);
  const startedAtDate = new Date();
  console.log("\n\n");
  log.info(
    `Proxying request ${requestCacheKey} to ${req.method} ${requestPath} with body`
  );
  log.printObject("Body", req.body);
  const headers = {
    Authorization: req.header("Authorization") || "",
    "X-Mangadex-Refresh-Token": req.header("X-Mangadex-Refresh-Token") || "",
    ...proxiedHeaders,
  };
  log.printObject("Headers", headers);

  const body = Object.keys(req.body).length === 0 ? undefined : req.body;

  request(
    {
      url: requestPath,
      method: req.method,
      headers,
      json: body,
    },
    function (error, response) {
      const endedAtDate = new Date();
      const completedInSeconds = (endedAtDate - startedAtDate) / 1000;
      if (error) {
        if (response) {
          log.error("error: " + response.statusCode);
        } else {
          log.error("unknown error!");
          log.debug(error);
          res.send({ error: true, unknown: true });
        }
      } else {
        console.log(
          endedAtDate,
          `Proxied request ${requestCacheKey} ended with status code`,
          response.statusCode,
          `(completed in ${completedInSeconds}s)`,
          "\n\n"
        );
        if (response.statusCode < 300) {
          cacheResponseBody(req, response.body);
        }
      }
    }
  ).pipe(res);
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
