"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
const permissions_1 = require("../utils/permissions");
function requireRole(roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized." });
        }
        if (!(0, permissions_1.checkPermission)(req.user.role, roles)) {
            return res.status(403).json({ error: "Forbidden." });
        }
        next();
    };
}
