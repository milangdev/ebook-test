const mongoose = require("mongoose");

const bookModel = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    sections: [
      {
        type: mongoose.Types.ObjectId,
        ref: "sections",
      },
    ],
    collaborator: [
      {
        type: mongoose.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.models.books || mongoose.model("books", bookModel);
