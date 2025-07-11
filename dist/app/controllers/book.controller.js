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
exports.booksRoutes = void 0;
const book_model_1 = require("../models/book.model");
const book_validation_1 = require("../validations/book.validation");
const express_1 = __importDefault(require("express"));
exports.booksRoutes = express_1.default.Router();
exports.booksRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const zodBody = yield book_validation_1.bookZodSchema.parseAsync(body);
        const book = yield book_model_1.Book.create(zodBody);
        res.status(201).json({
            success: true,
            message: "Book created successfuly",
            data: book,
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
exports.booksRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy = "createdAt", sort = "desc", limit = "10", } = req.query;
        const query = filter ? { genre: filter } : {};
        const books = yield book_model_1.Book.find(query)
            .sort({ [sortBy]: sort === "desc" ? -1 : 1 })
            .limit(Number(limit));
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
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
exports.booksRoutes.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        const books = yield book_model_1.Book.findById(id);
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: books,
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
exports.booksRoutes.patch("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        const body = req.body;
        const books = yield book_model_1.Book.findByIdAndUpdate(id, body);
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: books,
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
exports.booksRoutes.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        const books = yield book_model_1.Book.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
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
