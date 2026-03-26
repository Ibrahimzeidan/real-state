"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactSubmission = void 0;
const mongoose_1 = require("mongoose");
const ContactSubmissionSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    message: { type: String, required: true },
}, { timestamps: true });
exports.ContactSubmission = mongoose_1.models.ContactSubmission ||
    (0, mongoose_1.model)("ContactSubmission", ContactSubmissionSchema);
