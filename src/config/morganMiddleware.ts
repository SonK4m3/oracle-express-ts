import morgan, { StreamOptions } from "morgan";
import Logger from "../utils/logger";

require("dotenv").config();

const stream: StreamOptions = {
  write: (message: any) => Logger.http(message),
};

const skip = () => {
  const env = process.env.NODE_ENV || "debug";
  return env !== "debug";
};

// Build the morgan middleware
const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream, skip }
);

export default morganMiddleware;
