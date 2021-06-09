const redis = require("redis");
const sha256 = require("js-sha256").sha256;
const port = process.env.PORT || 3000;

const log = require("../logger.js");

// Initialize Redis client
const redisClient = redis.createClient(process.env.REDIS_URL);
redisClient.on("error", function (error) {
  log.error("Redis error", error);
});

// Helper methods
const { isPast, hoursFromNow } = require("../helpers.js");
const allowsCaching = (req) =>
  req.header("x-allow-cache") === "true" || req.query.cache === "true";
const cacheKey = (req) => {
  const { originalUrl, hostname, body } = req;
  const shouldAuthorize = req.header("x-should-auth") === "true";

  let value = `${hostname}:${port}${originalUrl}`;
  if (body) {
    const bodyKey = sha256(JSON.stringify(body));
    value = value.concat(`@body-${bodyKey}`);
  }

  let authorization = "anonymous";
  if (shouldAuthorize) {
    const bearerToken = req.header("Authorization") || "";
    authorization = bearerToken.includes("Bearer")
      ? bearerToken.split("Bearer")[1].trim()
      : "no-bearer";
  }
  value = value.concat(`@auth-${authorization}`);
  log.debug("cache key from", value);

  return sha256(value);
};

const cacheResponseBody = (req, response) => {
  if (!allowsCaching(req)) {
    log.warn("Skipping caching...");
    return;
  }

  let parsedResponse = null;

  try {
    parsedResponse =
      typeof response === "string" ? JSON.parse(response) : response;
  } catch (e) {
    log.error("Could not parse the response.", e);
    return null;
  }

  cacheAnything(req, parsedResponse);
};

const cacheImage = (req, img, type) => {
  if (!allowsCaching(req)) {
    log.warn("Skipping caching...");
    return;
  }

  let parsedResponse = {
    img,
    image: true,
    headers: { "Content-Type": `image/${type}` },
  };

  cacheAnything(req, parsedResponse);
};

const cacheAnything = (req, response) => {
  const cacheForHours =
    parseInt(req.header("X-Cache-For-Hour") || req.query.cache_duration) || 1;
  const responseToCache = {
    until: hoursFromNow(cacheForHours),
    response,
  };
  const stringResponse = JSON.stringify(responseToCache);
  redisClient.set(cacheKey(req), stringResponse, (err) => {
    if (err) {
      log.error(`[error] Could not cache request ${cacheKey(req)}:`, err);
    } else {
      log.debug(
        `Cached request key ${cacheKey(req)} for ${cacheForHours} hour(s).`
      );
    }
  });
};

// Middleware
const cacheMiddleware = (req, res, next) => {
  if (!allowsCaching(req)) {
    log.info("The request", cacheKey(req), "does not allow caching...");
    next();
    return;
  }

  const requestCacheKey = cacheKey(req);
  redisClient.get(requestCacheKey, (err, reply) => {
    if (err || reply === null) {
      if (err) {
        console.error("[error] Could not verify cached request, continuing...");
      } else {
        log.debug(
          `Request key ${requestCacheKey} is not cached yet, continuing...`
        );
      }
      next();
    } else {
      log.info("Returning cached response from request key", requestCacheKey);
      try {
        const cachedResponse = JSON.parse(reply);
        const cacheValidUntil = new Date(cachedResponse["until"]);
        if (isPast(cacheValidUntil)) {
          log.info("cache is expired, clearning up and fetching new batch...");
          redisClient.del(requestCacheKey);
          next();
        } else {
          if (!cachedResponse.response) {
            throw new Error("Missing cached response...");
          }

          const { response } = cachedResponse;

          if (response.image) {
            if (!response.img) {
              throw new Error("Missing cached image response...");
            }

            res.writeHead(200, {
              "Content-Type": `image/png`,
              "X-At-Home-Url": "unknown",
              "X-Cached-Image": "true",
            });
            res.end(response.img, "binary");
          } else {
            log.debug(cachedResponse);
            res.send({ ...cachedResponse["response"], cached: true });
          }
        }
      } catch (error) {
        log.warn(
          "Could not parse the cached response. Cleaning up and continuing..."
        );
        log.warn("reason:", error);
        redisClient.del(requestCacheKey);
        next();
      }
    }
  });
};

exports.cacheMiddleware = cacheMiddleware;
exports.cacheResponseBody = cacheResponseBody;
exports.cacheImage = cacheImage;
exports.cacheAnything = cacheAnything;
exports.cacheKey = cacheKey;
