const mongoose = require("mongoose");

const sectionModel = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: { type: String },
    parentSection: {
      type: mongoose.Types.ObjectId,
      ref: "sections",
    },
    book: {
      type: mongoose.Types.ObjectId,
      ref: "books",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.sections || mongoose.model("sections", sectionModel);
