const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
router.post('/register', register);
router.post('/login', login);
router.get('/admin', protect, adminOnly, (req, res) => {
  res.json({ msg: 'Welcome Admin!' });
});

module.exports = router;
