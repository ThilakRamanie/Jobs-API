const { StatusCodes } = require("http-status-codes");

const User = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    throw new UnauthenticatedError("User not found, please register");
  }
  const passwordChecked = await user.comparePassword(password);
  if (!passwordChecked) {
    throw new UnauthenticatedError("Invalid password");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { login, register };
