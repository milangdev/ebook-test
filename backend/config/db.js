const mongoose = require("mongoose");

const dbConnect = () => {
  try {
    mongoose.connect(process.env.CONNECTION_URL);
    console.log("Connected Successfully");
  } catch (error) {
    console.log("Connection Error");
  }
};

module.exports = dbConnect;
