"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const permissions_1 = require("../utils/permissions");
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: permissions_1.ROLE_OPTIONS, default: "VIEWER" },
}, { timestamps: true });
exports.User = mongoose_1.models.User || (0, mongoose_1.model)("User", UserSchema);
