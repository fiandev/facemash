/**
 *
 * @author arman
 * @since 15/2/2016.
 *
 */
"use strict";
const path = require("path");

const config = {
  local: {
    mode: "local",
    port: 3000,
    mysql: {
      host: "0.0.0.0",
      driver: "mysql",
      user: "root",
      database: "techmash",
      password: "root",
    },
  },
  staging: {
    mode: "staging",
    port: 4000,
    mysql: {
      host: "HOST_NAME",
      driver: "mysql",
      user: "USER_NAME",
      database: "DB_NAME",
      password: 123,
    },
  },
  production: {
    mode: "production",
    port: 5000,
    mysql: {
      host: "localhost",
      driver: "sqlite",
      storage: path.join(__dirname, "../db.sqlite"),
    },
  },
};

module.exports = function (mode) {
  return config[mode || process.argv[2] || "local"] || config.local;
};
