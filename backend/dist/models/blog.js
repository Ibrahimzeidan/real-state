"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const mongoose_1 = require("mongoose");
const BlogSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    image: { type: String },
    authorId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
BlogSchema.index({ title: "text", content: "text" });
exports.Blog = mongoose_1.models.Blog || (0, mongoose_1.model)("Blog", BlogSchema);
