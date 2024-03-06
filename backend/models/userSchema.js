const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["author", "collaborator"],
      default: "collaborator",
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userModel.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const genSalt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, genSalt);
  next();
});

userModel.methods.comparePassword = async function (pass) {
  return await bcrypt.compare(pass, this.password);
};

userModel.methods.generateToken = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
  });
};

module.exports = mongoose.models.users || mongoose.model("users", userModel);
