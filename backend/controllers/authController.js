const { registerUser, loginUser } = require('../services/authService');
const logger = require('../utils/logger');

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const user = await registerUser(name, email, password);
    logger.info({ userId: user.id }, 'New user registered');
    res.status(201).json({ success: true, user });
  } catch (err) {
    next(err); // passes to global error handler
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const { token, user } = await loginUser(email, password);
    logger.info({ userId: user.id }, 'User logged in');
    res.status(200).json({ success: true, token, user });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login };