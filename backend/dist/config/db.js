"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = connectDb;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
let isConnected = false;
async function connectDb() {
    if (isConnected) {
        return;
    }
    await mongoose_1.default.connect(env_1.env.MONGODB_URI, {
        dbName: env_1.env.MONGODB_DB || undefined,
        bufferCommands: false,
    });
    isConnected = true;
}
