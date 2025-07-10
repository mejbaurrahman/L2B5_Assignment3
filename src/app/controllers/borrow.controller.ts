import express, { Request, Response } from "express";
import { borrowZodSchema } from "../validations/borrow.validation";
import { Borrow } from "../models/borrow.model";
import { Book } from "../models/book.model";

export const borrowRoutes = express.Router();

borrowRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const zodBorrowBody = await borrowZodSchema.parseAsync(body);
    const book = await Book.findById(zodBorrowBody.book);
    if (!book) {
      res.status(400).json({
        message: "Book not found",
        success: false,
      });
    } else if (book?.copies < zodBorrowBody.quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough copies available",
      });
    } else {
      book.copies = book.copies - zodBorrowBody.quantity;

      const isBookAvaiable = await book.updateAvailability();
      if (!isBookAvaiable) {
        return res.status(400).json({
          message: "Book not available",
          success: false,
        });
      }
      const borrow = await Borrow.create(zodBorrowBody);
      res.status(200).json({
        success: true,
        message: "Book borrowed successfully",
        data: borrow,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: "Validation failed",
      success: false,
      error,
    });
  }
});

borrowRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const borrow = await Borrow.aggregate([
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
  } catch (error: any) {
    res.status(500).json({
      message: "Validation failed",
      success: false,
      error,
    });
  }
});
