"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const mongoose_1 = require("mongoose");
const ServiceSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
}, { timestamps: true });
exports.Service = mongoose_1.models.Service || (0, mongoose_1.model)("Service", ServiceSchema);
