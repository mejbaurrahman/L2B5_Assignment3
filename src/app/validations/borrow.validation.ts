import { z } from "zod";
import mongoose from "mongoose";

export const borrowZodSchema = z.object({
  book: z
    .string({
      required_error: "Book ID is required",
    })
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid Book ID format",
    }),

  quantity: z
    .number({
      required_error: "Quantity is required",
    })
    .int({ message: "Quantity must be an integer" })
    .min(1, { message: "Quantity must be a positive number" }),

  dueDate: z.string({
    required_error: "Due date is required",
  }),
});
