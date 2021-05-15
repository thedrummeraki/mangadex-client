const e = require("express");
const strftime = require("strftime");
const { cacheKey } = require("./middleware/cache");
const formatDatetime = strftime.localizeByIdentifier("en_CA");

const INFO_LEVEL = "INFO";
const WARNING_LEVEL = "WARNING";
const ERROR_LEVEL = "ERROR";
const FATAL_LEVEL = "FATAL";
const DEBUG_LEVEL = "DEBUG";

const print = (level, message, ...otherParams) => {
  console.log(
    `[${level}] (${formatDatetime("%F %T", new Date())})`,
    message,
    ...otherParams
  );
};

const printObject = (identifier, object) => {
  const sensitiveFields = ["Authorization", "password"];
  if (process.env.DEBUG === "true") {
    debug(`${identifier}:`, object);
  } else {
    const copiedObject = { ...object };
    Object.keys(copiedObject).forEach((key) => {
      if (sensitiveFields.includes(key)) {
        copiedObject[key] = "[REDACTED]";
      }
    });
    info(`${identifier}:`, copiedObject);
  }
};

const info = (message, ...otherParams) => {
  print(INFO_LEVEL, message, ...otherParams);
};

const warn = (message, ...otherParams) => {
  print(WARNING_LEVEL, message, ...otherParams);
};

const error = (message, ...otherParams) => {
  print(ERROR_LEVEL, message, ...otherParams);
};

const fatal = (message, ...otherParams) => {
  print(FATAL_LEVEL, message, ...otherParams);
};

const debug = (message, ...otherParams) => {
  if (process.env.DEBUG === "true") {
    print(DEBUG_LEVEL, message, ...otherParams);
  }
};

const basicExpressLogger = function (req, res, next) {
  const start = new Date();
  print(
    INFO_LEVEL,
    `(${cacheKey(req).slice(0, 10)})`,
    "\x1b[36m",
    req.method.toUpperCase(),
    "\x1b[0m",
    req.originalUrl
  );
  debug(`(${cacheKey(req).slice(0, 10)})`, "Headers:", req.headers);

  res.on("finish", () => {
    const end = new Date();
    const elapsedMs = end - start;

    print(
      INFO_LEVEL,
      `(${cacheKey(req).slice(0, 10)})`,
      "\x1b[36m",
      req.method.toUpperCase(),
      "\x1b[0m",
      req.originalUrl,
      `ended in ${elapsedMs}ms (${res.statusCode})`
    );
  });

  next();
};

exports.basicExpressLogger = basicExpressLogger;
exports.debug = debug;
exports.warn = warn;
exports.error = error;
exports.fatal = fatal;
exports.info = info;
exports.printObject = printObject;
