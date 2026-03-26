import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }
  return uri;
}

export async function connectToDatabase() {
  const uri = getMongoUri();
  const cached = global.mongoose ?? { conn: null, promise: null };

  if (!global.mongoose) {
    global.mongoose = cached;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      dbName: process.env.MONGODB_DB || undefined,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
