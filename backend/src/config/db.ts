import mongoose from "mongoose";

import { env } from "./env";

let isConnected = false;

export async function connectDb() {
  if (isConnected) {
    return;
  }

  await mongoose.connect(env.MONGODB_URI, {
    dbName: env.MONGODB_DB || undefined,
    bufferCommands: false,
  });

  isConnected = true;
}
