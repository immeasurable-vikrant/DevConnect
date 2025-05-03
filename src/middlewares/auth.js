const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const secretKey = 'devConnect@123';

const userAuth = async (req, res, next) => {
  try {

	// read the token from rge req cookies
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login!");
    }

	// validate the token
    const decodedObj = await jwt.verify(token, secretKey);
    const { _id } = decodedObj;
	
	// find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};