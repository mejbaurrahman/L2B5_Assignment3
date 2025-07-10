import { model, Schema } from "mongoose";
import { BookInstanceMethods, IBook } from "../interfaces/book.interface";

const bookSchema = new Schema<IBook, {}, BookInstanceMethods>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: {
      type: String,
      required: true,
      enum: [
        "FICTION",
        "NON_FICTION",
        "SCIENCE",
        "HISTORY",
        "BIOGRAPHY",
        "FANTASY",
      ],
    },
    isbn: { type: String, required: true, unique: true },
    description: { type: String },
    copies: {
      type: Number,
      required: true,
      min: [0, "Copies must be a non-negative number"],
    },
    available: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

bookSchema.method("updateAvailability", async function () {
  this.available = this.copies > 0;
  await this.save();
  return this.available;
});

export const Book = model("Book", bookSchema);
