const express = require("express");

const router = express.Router();
const { getProducts, buy } = require("../controllers/productController");
const { protect } = require("../middleware/auth");

router.route("/").get(getProducts);
router.route("/buy").post(protect, buy);

module.exports = router;
