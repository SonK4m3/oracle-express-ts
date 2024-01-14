import OracleDB from "oracledb";
import Logger from "./logger";

require("dotenv").config();

const dbConfig: OracleDB.ConnectionAttributes = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PWD,
  connectString: process.env.ORACLE_CONNECT_STRING,
};

const poolConfig: OracleDB.PoolAttributes = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PWD,
  connectString: process.env.ORACLE_CONNECT_STRING,
  poolMin: 4,
  poolMax: 20,
  poolIncrement: 2,
  poolTimeout: 60,
};

export default class DBConnection {
  private static connection: OracleDB.Connection | null = null;
  private static pool: OracleDB.Pool | null = null;

  static async connectToDb(): Promise<void> {
    if (this.connection) {
      return;
    }

    try {
      this.connection = await OracleDB.getConnection(dbConfig);
      Logger.info("Connected to the database successfully.");
    } catch (error) {
      Logger.error("Database connection failed: " + error);
      throw error;
    }
  }

  static async initializePool(): Promise<void> {
    try {
      this.pool = await OracleDB.createPool(poolConfig);
      Logger.info("Connection pool started successfully.");
    } catch (error) {
      Logger.error("Error creating connection pool: " + error);
      throw error;
    }
  }

  static async getConnection(): Promise<OracleDB.Connection> {
    if (!this.pool) {
      throw new Error("Connection pool not initialized.");
    }
    return this.pool.getConnection();
  }

  static async closePool(): Promise<void> {
    if (this.pool) {
      await this.pool.close();
      Logger.info("Connection pool closed.");
    }
  }

  // static async getConnection(): Promise<OracleDB.Connection | null> {
  //   if (!this.connection) {
  //     await this.connectToDb();
  //   }

  //   return this.connection;
  // }
}
