const express = require("express");
const router = express.Router();

// Example route for user registration
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});
module.exports = router;