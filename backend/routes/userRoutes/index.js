const yup = require("yup");
const express = require("express");
const route = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const UserModel = require("../../models/userSchema");
const responses = require("./responses");

const validate = require("../../utils/validate");
const responseHandler = require("../../utils/responseHandler");
const httpStatus = require("../../utils/httpStatus");

const userType = ["author", "collaborator"];

const registerSchema = yup.object({
  username: yup.string().required(),
  email: yup.string().email("Not a valid email").required(),
  role: yup.string().required().oneOf(userType),
  password: yup
    .string()
    .max(16, "Password is too long - should be 16 chars maximum.")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .required(),
});

const loginSchema = yup.object({
  email: yup.string().email("Not a valid email").required(),
  password: yup
    .string()
    .max(16, "Password is too long - should be 16 chars maximum.")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .required(),
});

route.post("/register", validate(registerSchema), async (req, res) => {
  try {
    const { username, email, role, password } = req.body;

    const isEmail = await UserModel.findOne({ email });

    if (isEmail) {
      return responseHandler.fail(
        res,
        responses.emailAlreadyExists,
        {},
        httpStatus.BAD_REQUEST
      );
    }

    const newUser = new UserModel({
      username,
      email,
      role,
      password,
    });

    const user = await newUser.save();

    if (user._id) {
      const token = await user.generateToken();
      return responseHandler.success(
        res,
        { data: user, token },
        responses.registeredSuccessfully
      );
    }
  } catch (error) {
    return responseHandler.fail(
      res,
      error?.message,
      error,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
});

route.post("/login", validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    const isEmail = await UserModel.findOne({ email: email });
    if (!isEmail) {
      return responseHandler.fail(
        res,
        responses.invalidEmailid,
        {},
        httpStatus.BAD_REQUEST
      );
    }

    const isPassword = await isEmail.comparePassword(password);
    if (!isPassword) {
      return responseHandler.fail(
        res,
        responses.incorrectPassword,
        {},
        httpStatus.BAD_REQUEST
      );
    }

    if (isEmail && isPassword) {
      const token = await isEmail.generateToken();

      return responseHandler.success(
        res,
        { data: isEmail, token },
        responses.loginSuccessfully
      );
    }
  } catch (error) {
    return responseHandler.fail(
      res,
      error?.message,
      error,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
});

route.get("/users", authMiddleware, async (req, res) => {
  try {
    const { role } = req.query;

    const user = await UserModel.aggregate([
      { $match: role ? { role: role } : {} },
      {
        $project: {
          _id: "$_id",
          username: 1,
        },
      },
    ]);
    return responseHandler.success(res, user);
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
