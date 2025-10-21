require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const cookieParser = require("cookie-parser");

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user.route");
const path = require("path");
const connectDB = require("./config/db");
const session = require("express-session");

// ✅ Add cookie-parser middleware HERE (before routes)
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "fgjfdkgldfjhgljh", // change this to something unique and strong
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true if using HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", indexRouter);
app.use("/", userRouter);

connectDB();
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
