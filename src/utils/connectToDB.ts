import Logger from "./logger";

var oracledb = require("oracledb");
require("dotenv").config();

const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PWD,
  connectString: process.env.ORACLE_CONNECT_STRING,
};

const connectToDb = async () => {
  try {
    await oracledb.getConnection(dbConfig);
    Logger.info("Connection with database");
  } catch (error) {
    process.exit(1);
  }
};

export default connectToDb;
