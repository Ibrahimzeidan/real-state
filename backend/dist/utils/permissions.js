"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_OPTIONS = exports.Roles = void 0;
exports.checkPermission = checkPermission;
exports.Roles = {
    ADMIN: "ADMIN",
    BLOG_EDITOR: "BLOG_EDITOR",
    PROJECT_EDITOR: "PROJECT_EDITOR",
    VIEWER: "VIEWER",
};
exports.ROLE_OPTIONS = [
    exports.Roles.ADMIN,
    exports.Roles.BLOG_EDITOR,
    exports.Roles.PROJECT_EDITOR,
    exports.Roles.VIEWER,
];
function checkPermission(userRole, required) {
    if (userRole === exports.Roles.ADMIN) {
        return true;
    }
    const requiredRoles = Array.isArray(required) ? required : [required];
    return requiredRoles.includes(userRole);
}
