const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).send({ msg: "Not authorize to access this route" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (req.user === null) {
      return res.status(403).send({ msg: "Un authorize to access" });
    }

    next();
  } catch (err) {
    return res.status(401).send({ msg: "Not authorize to access this route" });
  }
};

module.exports = { protect };
