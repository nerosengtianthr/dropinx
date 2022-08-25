const User = require("../models/User");
const jwt = require("jsonwebtoken");

const me = async (req, res) => {
  try {
    res.status(200).send({ success: true, result: req.user });
  } catch (error) {
    return res.status(500).send({ msg: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate email and Password
    if (!username || !password) {
      return res
        .status(403)
        .send({ msg: "Please provide an username or password" });
    }

    // Check for user
    const user = await User.findOne({ username }).select("+username");

    if (!user) {
      return res.status(403).send({ msg: "Username or Password incollect" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(403).send({ msg: "Username or Password incollect" });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    return res.status(500).send({ msg: error.message });
  }
};

const register = async (req, res, next) => {
  try {
    const form = req.body;

    const saveUser = new User({ ...form });

    const newUser = await saveUser.save();

    console.log(newUser);

    sendTokenResponse(newUser, 200, res);
  } catch (error) {
    return res.status(500).send({ msg: error.message });
  }
};

// Get token from model, Create cookie and send response
const sendTokenResponse = async (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const res_user = await User.findById(decoded.id).select("-password");

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token, ...res_user._doc });
};

module.exports = { login, me, register };
