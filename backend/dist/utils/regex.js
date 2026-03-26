"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeRegex = escapeRegex;
function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
