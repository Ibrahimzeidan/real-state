"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectInterest = void 0;
const mongoose_1 = require("mongoose");
const ProjectInterestSchema = new mongoose_1.Schema({
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Project", required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    message: { type: String, required: true },
}, { timestamps: true });
exports.ProjectInterest = mongoose_1.models.ProjectInterest || (0, mongoose_1.model)("ProjectInterest", ProjectInterestSchema);
