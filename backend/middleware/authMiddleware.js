const jwt = require("jsonwebtoken");
const UserModel = require("../models/userSchema");
const httpStatus = require("../utils/httpStatus");
const responses = require("./responses");
const responseHandler = require("../utils/responseHandler");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return responseHandler.fail(
        res,
        responses.sessionExpired,
        {},
        httpStatus.BAD_REQUEST
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded?.id);
    if (!user) {
      return responseHandler.fail(
        res,
        responses.notAuthorized,
        {},
        httpStatus.UNAUTHORIZED
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return responseHandler.fail(
      res,
      responses.sessionExpired,
      {},
      httpStatus.UNAUTHORIZED
    );
  }
};
module.exports = authMiddleware;
