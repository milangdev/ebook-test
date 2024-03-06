const express = require("express");
const route = express.Router();
const userRoutes = require("./userRoutes");
const bookRoutes = require("./bookRoutes");
const sectionRoutes = require("./sectionRoutes");

route.use("/auth", userRoutes);
route.use("/book", bookRoutes);
route.use("/section", sectionRoutes);

module.exports = route;
