"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageContent = void 0;
const mongoose_1 = require("mongoose");
const PageContentSchema = new mongoose_1.Schema({
    pageName: { type: String, required: true, unique: true, trim: true },
    content: { type: mongoose_1.Schema.Types.Mixed, required: true },
}, { timestamps: true });
exports.PageContent = mongoose_1.models.PageContent || (0, mongoose_1.model)("PageContent", PageContentSchema);
