const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

router.route('/')
  .get(protect, getBooks)
  .post(protect, adminOnly, createBook)
  .delete(protect, adminOnly, deleteBook);

router.route('/:id')
  .get(protect, getBookById)
  .put(protect, adminOnly, updateBook)
  .delete(protect, adminOnly, deleteBook); 

module.exports = router;
