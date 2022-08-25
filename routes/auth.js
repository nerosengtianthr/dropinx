const express = require("express");

const router = express.Router();
const { protect } = require("../middleware/auth");
const { login, me, register } = require("../controllers/authController");

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/me").get(protect, me);

module.exports = router;
