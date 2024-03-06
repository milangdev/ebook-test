const yup = require("yup");
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

const sectionSchema = yup.object({
  title: yup.string().required(),
  content: yup.string(),
  parentSection: yup.string(),
  book: yup.string(),
});

const sectionUpdateSchema = yup.object({
  title: yup.string(),
  content: yup.string(),
});

route.post(
  "/",
  authMiddleware,
  authorMiddleware,
  validate(sectionSchema),
  async (req, res) => {
    try {
      const { title, content, parentSection, book } = req.body;

      const newSection = new SectionModel({
        title,
        content,
        parentSection,
        book,
      });

      const section = await newSection.save();

      if (!parentSection) {
        await BookModel.findByIdAndUpdate(
          { _id: book },
          { $push: { sections: section._id } },
          { new: true }
        );
      }
      return responseHandler.success(
        res,
        section,
        responses.sectionCreatedSuccessfully
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

route.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const section = await SectionModel.findById(id)
      .populate({
        path: "book",
        match: {
          ...(req.user.role === "collaborator"
            ? {
                collaborator: {
                  $in: [req.user._id],
                },
              }
            : { author: req.user._id }),
        },
      })
      .exec();

    return responseHandler.success(res, section);
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
  validate(sectionUpdateSchema),
  async (req, res) => {
    try {
      const { id } = req.params;
      let section;
      const isUserAuthorized = await SectionModel.findById(id)
        .populate({
          path: "book",
          match: {
            ...(req.user.role === "collaborator"
              ? {
                  collaborator: {
                    $in: [req.user._id],
                  },
                }
              : { author: req.user._id }),
          },
        })
        .exec();

      if (isUserAuthorized) {
        section = await SectionModel.findByIdAndUpdate(
          { _id: id },
          { ...req.body },
          { new: true }
        );
      }

      return responseHandler.success(
        res,
        book,
        responses.sectionUpdatedSuccessfully
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

    const isSection = await SectionModel.findById(id);

    if (!isSection) {
      return responseHandler.fail(
        res,
        responses.sectionNotFound,
        null,
        httpStatus.NOT_FOUND
      );
    }

    if (!isSection.parentSection) {
      await BookModel.findByIdAndUpdate(
        {
          _id: isSection.book,
        },
        { $pull: { sections: isSection._id } },
        { new: true }
      );
    }

    async function deleteChildSections(sectionId) {
      const childSections = await SectionModel.find({
        parentSection: sectionId,
      });

      for (const childSection of childSections) {
        await deleteChildSections(childSection._id);
      }

      await SectionModel.deleteMany({
        _id: { $in: childSections.map((s) => s._id) },
      });
    }
    await deleteChildSections(id);

    await SectionModel.deleteOne({ _id: id });

    return responseHandler.success(
      res,
      {},
      responses.sectionDeletedSuccessfully
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

module.exports = route;
