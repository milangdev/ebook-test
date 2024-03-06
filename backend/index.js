const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();

const dbConnect = require("./config/db");

const routes = require("./routes");

dotenv.config();

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "*",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "authorization"],
};

dbConnect();
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", routes);

const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log("process is running on ", port);
});
