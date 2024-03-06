const httpStatus = require("../utils/httpStatus");
const responseHandler = require("../utils/responseHandler");
const responses = require("./responses");

const authorMiddleware = async (req, res, next) => {
  try {
    const { role } = req.user;

    if (role === "collaborator") {
      return responseHandler.fail(
        res,
        responses.userIsNotAuthor,
        {},
        httpStatus.BAD_REQUEST
      );
    }

    if (role === "author") {
      next();
    }
  } catch (error) {
    return responseHandler.fail(
      res,
      error?.message,
      error,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = authorMiddleware;
