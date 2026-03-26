"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const env_1 = require("./config/env");
const port = env_1.env.PORT;
(0, db_1.connectDb)()
    .then(() => {
    app_1.default.listen(port, () => {
        console.log(`Backend running on port ${port}`);
    });
})
    .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
