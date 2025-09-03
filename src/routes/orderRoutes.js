const express = require('express');
const router = express.Router();

const {
  purchaseBooks,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const { protect, adminOnly } = require('../middleware/authMiddleware');
router.post('/', protect, purchaseBooks);
router.get('/my-orders', protect, getMyOrders);
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:orderId', protect, adminOnly, updateOrderStatus);

module.exports = router;
