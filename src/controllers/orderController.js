const Order = require('../models/order');
const Book = require('../models/Book');
exports.purchaseBooks = async (req, res) => {
  const { books } = req.body;
try {
    if (!books || !Array.isArray(books) || books.length === 0) {
      return res.status(400).json({ msg: 'Books array is required and cannot be empty' });
    }

    const resolvedBooks = [];

    for (const item of books) {
      let bookId;

      if (item.book) {
        bookId = item.book;
      } else if (item.title) {
        const book = await Book.findOne({ title: item.title });
        if (!book) {
          return res.status(404).json({ msg: `Book not found with title: ${item.title}` });
        }
        bookId = book._id;
      } else {
        return res.status(400).json({ msg: 'Each book item must have either "book" (id) or "title"' });
      }

      resolvedBooks.push({ book: bookId, quantity: item.quantity || 1 });
    }

    const newOrder = await Order.create({ user: req.user.id, books: resolvedBooks });

    res.status(201).json({ msg: 'Order placed successfully', order: newOrder });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('user', 'name email')
      .populate('books.book');

    res.json(orders);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
exports.getAllOrders = async (req, res) => {
  const { status, userId } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (userId) filter.user = userId;

  try {
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('books.book');

    res.json(orders);
  } catch (err) {
    console.error('Error fetching all orders:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!updatedOrder) return res.status(404).json({ msg: 'Order not found' });

    res.json({ msg: 'Order updated', order: updatedOrder });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
