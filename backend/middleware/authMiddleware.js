const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const match = authHeader?.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = match[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = protect;