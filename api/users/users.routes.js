const express = require("express");
const passport = require("passport");
const router = express.Router();
const {
  signup,
  signin,
  getUsers,
  deleteUser,
  fetchUser,
} = require("./users.controllers");

router.param("userId", async (req, res, next, userId) => {
  const user = await fetchUser(userId, next);
  try {
    if (user) {
      req.user = user;
      next();
    } else {
      // const err = new Error("User Not Found!!");
      // err.status = 404;
      next("User Not Found!!");
    }
  } catch (err) {
    next(err);
  }
});

router.post("/signup", signup);

router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);
router.get("/users", getUsers);
router.delete("/:userId", deleteUser);

module.exports = router;
