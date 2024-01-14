require("dotenv").config();
var sworm = require("sworm");

var db = sworm.db({
  driver: "oracle",
  config: {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PWD,
    connectString: process.env.ORACLE_CONNECT_STRING,
    pool: true,

    options: {
      // options to set on `oracledb`
      maxRows: 1000,
    },
  },
});

module.exports = db;
