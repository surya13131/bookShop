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
    console.error('Token verification failed:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

exports.adminOnly = (req, res, next) => {
  
  if (!req.user) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admins only: Access forbidden' });
  }

  next();
};
