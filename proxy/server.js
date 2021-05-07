var express = require("express"),
  request = require("request"),
  bodyParser = require("body-parser"),
  geoip = require("geoip-lite"),
  app = express();

const log = require("./logger");

const qs = require("qs");
const axios = require("axios").default;

const {
  cacheMiddleware,
  cacheResponseBody,
  cacheKey,
} = require("./middleware/cache");

const port = process.env.PORT || 3000;
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const clientIDSecret = `${clientID}:${clientSecret}`;
const redirectPath = "/auth/misete/callback";
const redirectURL = `${
  process.env.REDIRECT_HOST || `http://localhost:${port}`
}${redirectPath}`;
const oauthProviderHost =
  process.env.OAUTH_PROVIDER_HOST || "https://accounts.misete.io";
const scopes = ["profile"].join(" ");

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
    return redirectURL;
  }

  return matchingOriginURL;
};

const getRedirectURI = (req) => {
  try {
    return new URL(redirectPath, getOriginURL(req)).toString();
  } catch (e) {
    console.error(e);
    return redirectURL;
  }
};

app.use(express.json());
app.use(log.basicExpressLogger);

var myLimit = typeof process.argv[2] != "undefined" ? process.argv[2] : "100kb";
log.debug("Using limit: ", myLimit);

app.get("/authorize", (req, res) => {
  const authorizeURLParams = [
    `client_id=${clientID}`,
    "response_type=code",
    `redirect_uri=${getRedirectURI(req)}`,
    `scope=${scopes}`,
  ].join("&");

  if (!clientID || !clientSecret) {
    res.send({
      success: false,
      message: "missing client id and client secret",
    });
  } else {
    res.redirect(`${oauthProviderHost}/oauth/authorize?${authorizeURLParams}`);
  }
});

app.get("/my-account", (req, res) => {
  res.redirect(`${oauthProviderHost}/me`);
});

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

const authenticateWithOAuthProvider = async (headers, req, res) => {
  const bearerToken = req.header("Authorization") || "";

  if (bearerToken.trim().length === 0) {
    log.error("No bearer token was found.");
    throw new Error("No bearer token was found.");
  }

  const { data } = await axios.request({
    baseURL: oauthProviderHost,
    method: "GET",
    url: "/me.json",
    headers: {
      Authorization: bearerToken,
    },
  });

  if (data.uuid) {
    headers["X-Proxied-Auth-ID"] = data.uuid;
    return data;
  }

  throw new Error("No user was found.");
};

app.use(allowCrossDomain);

// To be called from the client
app.get(redirectPath, (req, res) => {
  const { code, error } = req.query;

  if (error) {
    res.send({ success: false, error });
  } else {
    const authorizationBody = {
      grant_type: "authorization_code",
      client_id: clientID,
      client_secret: clientSecret,
      redirect_uri: getRedirectURI(req),
      code,
    };

    axios
      .request({
        baseURL: oauthProviderHost,
        method: "POST",
        url: "/oauth/token",
        data: qs.stringify(authorizationBody),
      })
      .then((response) => {
        res.send({
          success: true,
          response: response.data,
        });
      })
      .catch((error) => {
        log.error(error.toString());
        res.send({
          success: false,
          message: "that did not work",
          error: error,
        });
      });
  }
});

app.get("/me", async (req, res) => {
  const bearerToken = req.header("Authorization") || "";

  if (bearerToken.trim().length === 0) {
    log.debug("Skipping authentication because bearer token is not present...");

    res.send({
      success: false,
      warning: true,
      message: "Skipping authentication...",
      error: "Unauthenticated request",
    });

    return;
  }

  try {
    const response = await axios.request({
      baseURL: oauthProviderHost,
      method: "GET",
      url: "/me.json",
      headers: {
        Authorization: bearerToken,
      },
    });

    res.send({
      success: true,
      response: response.data,
    });
  } catch (error) {
    log.error(error.toString());
    res.status(401).send({
      success: false,
      message: "that did not work",
      error,
    });
  }
});

app.post("/refresh", async (req, res) => {
  const refreshToken = req.header("X-Refresh-Token") || "";

  const authorizationBody = {
    grant_type: "refresh_token",
    client_id: clientID,
    client_secret: clientSecret,
    refresh_token: refreshToken,
  };

  console.log(authorizationBody);

  try {
    const { data } = await axios.request({
      baseURL: oauthProviderHost,
      method: "POST",
      url: "/oauth/token",
      data: qs.stringify(authorizationBody),
    });

    res.send({
      success: true,
      response: data,
    });
  } catch (error) {
    log.error(error.toString());
    res.status(error.response.status).send({
      success: false,
      message: "that did not work",
      error: error,
    });
  }
});

app.delete("/logout", (req, res) => {
  axios
    .request({
      baseURL: oauthProviderHost,
      method: "POST",
      url: "/oauth/revoke",
      headers: {
        Authorization: `Basic ${Buffer.from(clientIDSecret).toString(
          "base64"
        )}`,
      },
    })
    .then((response) => {
      res.send({
        success: true,
        response,
      });
    })
    .catch((error) => {
      log.error(error.toString());
      res.send({
        success: false,
        message: "that did not work",
        error: error,
      });
    });
});

app.use(cacheMiddleware);

app.use(bodyParser.json({ limit: myLimit }));
// app.use(authenticateWithOAuthProvider);

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
    authenticateWithOAuthProvider(proxiedHeaders, req, res)
      .then((user) => {
        log.debug(`Request made by ${user.name} (${user.uuid})`);
      })
      .catch((err) =>
        log.warn("Could not authenticate with OAuth provider:", err.toString())
      )
      .finally(() => proxyRequest(req, res, requestPath, proxiedHeaders));
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
      host: originatingHost || currentHostname,
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
  console.log(req.body);
  log.info("headers", {
    Authorization: req.header("Authorization") ? "[REDACTED]" : "undefined",
    ...proxiedHeaders,
  });

  request(
    {
      url: targetURL + req.url,
      method: req.method,
      json: req.body,
      headers: {
        Authorization: req.header("Authorization"),
        ...proxiedHeaders,
      },
    },
    function (error, response) {
      const endedAtDate = new Date();
      const completedInSeconds = (endedAtDate - startedAtDate) / 1000;
      if (error) {
        if (response) {
          log.error("error: " + response.statusCode);
        } else {
          log.error("unknown error!");
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
