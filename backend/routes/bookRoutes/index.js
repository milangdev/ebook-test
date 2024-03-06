const yup = require("yup");
const { default: mongoose } = require("mongoose");
const express = require("express");
const route = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const authorMiddleware = require("../../middleware/authorMiddleware");

const BookModel = require("../../models/bookSchema");
const SectionModel = require("../../models/sectionSchema");
const responses = require("./responses");

const validate = require("../../utils/validate");
const responseHandler = require("../../utils/responseHandler");
const httpStatus = require("../../utils/httpStatus");
const { sortByCreatedAt } = require("../../utils/functions");

const bookSchema = yup.object({
  title: yup.string().required(),
  content: yup.string(),
  collaborator: yup.array().of(yup.string()),
});

const bookUpdateSchema = yup.object({
  title: yup.string(),
  content: yup.string(),
});

route.post(
  "/",
  authMiddleware,
  authorMiddleware,
  validate(bookSchema),
  async (req, res) => {
    try {
      const { _id } = req.user;

      const newBook = new BookModel({
        ...req.body,
        author: _id,
      });
      const book = await newBook.save();

      return responseHandler.success(
        res,
        book,
        responses.bookCreatedSuccessfully
      );
    } catch (error) {
      return responseHandler.fail(
        res,
        error?.message,
        error,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
);

route.get("/", authMiddleware, async (req, res) => {
  try {
    const books = await BookModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "collaborator",
          foreignField: "_id",
          as: "collaborator",
          pipeline: [{ $project: { password: 0 } }],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
          pipeline: [{ $project: { password: 0 } }],
        },
      },
      {
        $addFields: {
          author: { $arrayElemAt: ["$author", 0] },
        },
      },
      { $project: { sections: 0 } },
    ]);

    return responseHandler.success(res, books);
  } catch (error) {
    return responseHandler.fail(
      res,
      error?.message,
      error,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
});

route.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const books = await BookModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
          ...(req.user.role === "collaborator"
            ? {
                collaborator: {
                  $in: [req.user._id],
                },
              }
            : { author: req.user._id }),
        },
      },
      {
        $lookup: {
          from: "sections",
          localField: "sections",
          foreignField: "_id",
          as: "sections",
          pipeline: [
            {
              $graphLookup: {
                from: "sections",
                startWith: "$_id",
                connectFromField: "_id",
                connectToField: "parentSection",
                as: "nestedChildren",
              },
            },
          ],
        },
      },
      {
        $project: {
          author: 0,
          collaborator: 0,
          "sections.content": 0,
          "sections.nestedChildren.content": 0,
        },
      },
    ]);

    const buildNestedHierarchy = (sections, p_id) => {
      const filterChildrenByParentSection = (children, parentId) => {
        return children.filter((child) => child.parentSection.equals(parentId));
      };

      const getChildren = (parentId) => {
        const children = filterChildrenByParentSection(sections, parentId);

        return children.map((child) => {
          const nestedChildren = buildNestedHierarchy(sections, child._id);
          if (nestedChildren.length > 0) {
            return { ...child, nestedChildren };
          }
          return { ...child };
        });
      };

      return getChildren(p_id);
    };

    const structuredResult = books.map((book) => ({
      ...book,
      sections: book.sections.map((item) => ({
        ...item,
        nestedChildren: buildNestedHierarchy(
          sortByCreatedAt(item.nestedChildren),
          item._id
        ),
      })),
    }));

    return responseHandler.success(res, structuredResult);
  } catch (error) {
    return responseHandler.fail(
      res,
      error?.message,
      error,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
});

route.put(
  "/:id",
  authMiddleware,
  validate(bookUpdateSchema),
  async (req, res) => {
    try {
      const { id } = req.params;

      const book = await BookModel.findByIdAndUpdate(
        { _id: id },
        { ...req.body },
        { new: true }
      );

      return responseHandler.success(
        res,
        book,
        responses.bookUpdatedSuccessfully
      );
    } catch (error) {
      return responseHandler.fail(
        res,
        error?.message,
        error,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
);

route.delete("/:id", authMiddleware, authorMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const isBook = await BookModel.findById(id);

    if (!isBook) {
      return responseHandler.fail(
        res,
        responses.bookNotFound,
        null,
        httpStatus.NOT_FOUND
      );
    }

    const sections = await SectionModel.deleteMany({ book: isBook._id });

    const book = await BookModel.findByIdAndDelete(id);

    return responseHandler.success(
      res,
      { sections, book },
      responses.bookDeletedSuccessfully
    );
  } catch (error) {
    return responseHandler.fail(
      res,
      error?.message,
      error,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
});

route.post(
  "/updateCollaborator",
  authMiddleware,
  authorMiddleware,
  async (req, res) => {
    try {
      const { bookId, collaborator } = req.body;

      const bookCollaborator = await BookModel.findByIdAndUpdate(
        {
          _id: bookId,
        },
        { collaborator: collaborator },
        { new: true }
      );

      return responseHandler.success(
        res,
        bookCollaborator,
        responses.collaboratorUpdatedSuccessfully
      );
    } catch (error) {
      return responseHandler.fail(
        res,
        error?.message,
        error,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
);

module.exports = route;
