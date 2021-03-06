import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: false },
    slug: { type: String, required: true, unique: true },
    image: { path: String, height: Number, width: Number, info: String },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    featured: { type: Boolean, required: true, default: false },
    author: { type: mongoose.Types.ObjectId, ref: "User" },
    comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);
export default mongoose.model("Article", articleSchema);

