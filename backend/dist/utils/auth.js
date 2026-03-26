"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.verifyAccessToken = verifyAccessToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
function signAccessToken(user) {
    return jsonwebtoken_1.default.sign({
        name: user.name,
        email: user.email,
        role: user.role,
    }, env_1.env.JWT_SECRET, {
        subject: user.id,
        expiresIn: env_1.env.JWT_EXPIRES_IN,
    });
}
function verifyAccessToken(token) {
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        if (!payload?.sub || !payload?.email || !payload?.role) {
            return null;
        }
        return {
            id: String(payload.sub),
            name: String(payload.name || ""),
            email: String(payload.email),
            role: payload.role,
        };
    }
    catch {
        return null;
    }
}
