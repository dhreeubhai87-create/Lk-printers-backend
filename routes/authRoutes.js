const express = require("express");
const router = express.Router();

const { register, login, signup } = require("../controllers/authController");

router.post("/signup", signup || register);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
