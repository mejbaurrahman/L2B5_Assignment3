"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const borrow_validation_1 = require("../validations/borrow.validation");
const borrow_model_1 = require("../models/borrow.model");
const book_model_1 = require("../models/book.model");
exports.borrowRoutes = express_1.default.Router();
exports.borrowRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const zodBorrowBody = yield borrow_validation_1.borrowZodSchema.parseAsync(body);
        const book = yield book_model_1.Book.findById(zodBorrowBody.book);
        if (!book) {
            res.status(400).json({
                message: "Book not found",
                success: false,
            });
        }
        else if ((book === null || book === void 0 ? void 0 : book.copies) < zodBorrowBody.quantity) {
            return res.status(400).json({
                success: false,
                message: "Not enough copies available",
            });
        }
        else {
            book.copies = book.copies - zodBorrowBody.quantity;
            const isBookAvaiable = yield book.updateAvailability();
            if (!isBookAvaiable) {
                return res.status(400).json({
                    message: "Book not available",
                    success: false,
                });
            }
            const borrow = yield borrow_model_1.Borrow.create(zodBorrowBody);
            res.status(200).json({
                success: true,
                message: "Book borrowed successfully",
                data: borrow,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Validation failed",
            success: false,
            error,
        });
    }
}));
exports.borrowRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const borrow = yield borrow_model_1.Borrow.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book",
                },
            },
            {
                $unwind: "$book",
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$book.title",
                        isbn: "$book.isbn",
                    },
                    totalQuantity: 1,
                },
            },
        ]);
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: borrow,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Validation failed",
            success: false,
            error,
        });
    }
}));
