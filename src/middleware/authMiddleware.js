const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ msg: 'Unauthorized: No user data' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access forbidden: Admins only' });
  }

  next();
};
