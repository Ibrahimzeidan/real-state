"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = require("mongoose");
const ProjectSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    details: { type: mongoose_1.Schema.Types.Mixed },
}, { timestamps: true });
ProjectSchema.index({ title: "text", description: "text" });
exports.Project = mongoose_1.models.Project || (0, mongoose_1.model)("Project", ProjectSchema);
