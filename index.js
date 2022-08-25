const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const path = require("path");
// define limit reqeust
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

dotenv.config();

//Database

const connectDb = require("./config/db");

connectDb();

const app = express();

app.use(express.json());
app.use(cors());
app.use(limiter);

app.get("/", (req, res) => {
  return res.status(200).send({
    success: true,
    msg: "DropinX interview API",
  });
});

// upload image
app.post("/api/upload", upload.single("img"), async (req, res) => {
  return res.status(200).send({
    success: true,
    path: req.file.path,
  });
});

app.use("/uploads", express.static("uploads"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/product", require("./routes/product"));

app.listen(5000, () => console.log("Server is running..."));
