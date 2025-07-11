"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.bookZodSchema = zod_1.default.object({
    title: zod_1.default.string({
        required_error: "Title is required",
    }),
    author: zod_1.default.string({
        required_error: "Author is required",
    }),
    genre: zod_1.default.enum(["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"], {
        required_error: "Genre is required",
    }),
    isbn: zod_1.default.string({
        required_error: "ISBN is required",
    }),
    description: zod_1.default.string().optional(),
    copies: zod_1.default
        .number({
        required_error: "Copies is required",
    })
        .min(0, { message: "Copies must be a non-negative number" }),
    available: zod_1.default.boolean().optional().default(true),
});
