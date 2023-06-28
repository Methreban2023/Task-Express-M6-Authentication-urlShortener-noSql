const connectDb = require("./database");
const express = require("express");
const passport = require("passport");
const app = express();
const urlRoutes = require("./api/urls/urls.routes");
const userRoutes = require("./api/users/users.routes");
const dontenv = require("dotenv");
const { localStrategy, jwtStrategy } = require("./middleware/passport");
const notFoundHandler = require("./middleware/notFoundHandler");
const errorHandler = require("./middleware/errorHandler");

dontenv.config();

connectDb();
app.use(express.json());

//passport
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use("/urls", urlRoutes);
app.use(userRoutes);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});
const PORT = process.env.PORT || 8000;

app.use(notFoundHandler);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("The application is running on localhost:8000");
});
