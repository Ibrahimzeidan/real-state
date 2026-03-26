"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const auth_1 = require("../utils/auth");
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized." });
    }
    const user = (0, auth_1.verifyAccessToken)(token);
    if (!user) {
        return res.status(401).json({ error: "Unauthorized." });
    }
    req.user = user;
    next();
}
