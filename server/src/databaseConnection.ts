import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";

mongoose.Promise = global.Promise;
dotenv.config();

const { DB_URI } = process.env;

const connectToDatabase = async (): Promise<void> => {
  const options: ConnectOptions = {};
  await mongoose.connect(<string>DB_URI, options);
  mongoose.connection.on(
    "error",
    console.error.bind(console, "MongoDb connection error: ")
  );
};

export { connectToDatabase };
