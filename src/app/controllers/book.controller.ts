import { Book } from "../models/book.model";
import { bookZodSchema } from "../validations/book.validation";

import express, { Request, Response } from "express";
export const booksRoutes = express.Router();

booksRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const zodBody = await bookZodSchema.parseAsync(body);
    const book = await Book.create(zodBody);
    res.status(201).json({
      success: true,
      message: "Book created successfuly",
      data: book,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Validation failed",
      success: false,
      error,
    });
  }
});

booksRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const {
      filter,
      sortBy = "createdAt",
      sort = "desc",
      limit = "10",
    } = req.query;
    const query: any = filter ? { genre: filter } : {};
    const books = await Book.find(query)
      .sort({ [sortBy as string]: sort === "desc" ? -1 : 1 })
      .limit(Number(limit));
    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Validation failed",
      success: false,
      error,
    });
  }
});

booksRoutes.get("/:bookId", async (req: Request, res: Response) => {
  try {
    const id = req.params.bookId;

    const books = await Book.findById(id);

    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: books,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Validation failed",
      success: false,
      error,
    });
  }
});

booksRoutes.patch("/:bookId", async (req: Request, res: Response) => {
  try {
    const id = req.params.bookId;
    const body = req.body;
    const books = await Book.findByIdAndUpdate(id, body);

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: books,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Validation failed",
      success: false,
      error,
    });
  }
});

booksRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  try {
    const id = req.params.bookId;
    const books = await Book.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Validation failed",
      success: false,
      error,
    });
  }
});
