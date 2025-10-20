require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const indexRouter = require("./routes/index");
const path = require("path");
const connectDB = require("./config/db");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", indexRouter);

connectDB();
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
