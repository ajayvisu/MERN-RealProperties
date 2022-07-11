const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const userRouter = require("./routes/user.route");
const propertyRouter = require("./routes/property.route");

const app = express();
require("dotenv").config();

app.listen(process.env.PORT || 4000, () => {
  // console.log("backend server running successfully! on port `${port}`");
  console.log("backend server running successfully!");
});

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected successfully!");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static("uploads"));

app.use("/api/users", userRouter);
app.use("/api/property", propertyRouter);

app.set("view engine", "ejs");
