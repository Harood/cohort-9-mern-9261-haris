const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');

const SALT_ROUNDS = 10;

const registerUser = async (name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  try {
    const userId = await createUser(name, email, hashedPassword);
    return { id: userId, name, email };
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      throw error;
    }
    throw err;
  }
};

const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return { token, user: { id: user.id, name: user.name, email: user.email } };
};

module.exports = { registerUser, loginUser };