// create user schema
const mongoose = require("mongoose");
const bcrypjs = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },

  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
    required: true,
  },
});

// Encrypt password using BcryptJS
User.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypjs.hash(this.password, 10);
  next();
});

// Sign JWT and return
User.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password
User.methods.matchPassword = async function (enteredPassword) {
  return await bcrypjs.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", User);
