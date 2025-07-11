"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowZodSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
exports.borrowZodSchema = zod_1.z.object({
    book: zod_1.z
        .string({
        required_error: "Book ID is required",
    })
        .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
        message: "Invalid Book ID format",
    }),
    quantity: zod_1.z
        .number({
        required_error: "Quantity is required",
    })
        .int({ message: "Quantity must be an integer" })
        .min(1, { message: "Quantity must be a positive number" }),
    dueDate: zod_1.z.string({
        required_error: "Due date is required",
    }),
});
