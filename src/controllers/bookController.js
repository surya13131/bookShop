const Book = require('../models/Book');
const Author = require('../models/Author');
const Category = require('../models/Category');

exports.createBook = async (req, res) => {
  try {
    const { title, authorName, categoryName, description } = req.body;
    let author = await Author.findOne({ name: { $regex: new RegExp(`^${authorName}$`, 'i') } });
    if (!author) {
      author = await Author.create({ name: authorName });
    }
    let category = await Category.findOne({ name: { $regex: new RegExp(`^${categoryName}$`, 'i') } });
    if (!category) {
      category = await Category.create({ name: categoryName });
    }

    const book = await Book.create({
      title,
      author: author._id,
      category: category._id,
      description,
    });
    const populatedBook = await Book.findById(book._id)
      .populate('author', 'name')
      .populate('category', 'name');

    res.status(201).json(populatedBook);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const { category, author } = req.query;
    const filter = {};

    if (category) {
      const categoryDoc = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
      if (!categoryDoc) {
        return res.status(404).json({ msg: 'Category not found' });
      }
      filter.category = categoryDoc._id;
    }

    if (author) {
      const authorDoc = await Author.findOne({ name: { $regex: new RegExp(`^${author}$`, 'i') } });
      if (!authorDoc) {
        return res.status(404).json({ msg: 'Author not found' });
      }
      filter.author = authorDoc._id;
    }

    const books = await Book.find(filter)
      .populate('author', 'name')
      .populate('category', 'name');

    res.json(books);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('author', 'name')
      .populate('category', 'name');

    if (!book) return res.status(404).json({ msg: 'Book not found' });

    res.json(book);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
exports.updateBook = async (req, res) => {
  try {
    const { authorName, categoryName, ...rest } = req.body;
    const updateData = { ...rest };

    if (authorName) {
      let author = await Author.findOne({ name: { $regex: new RegExp(`^${authorName}$`, 'i') } });
      if (!author) {
        author = await Author.create({ name: authorName });
      }
      updateData.author = author._id;
    }

    if (categoryName) {
      let category = await Category.findOne({ name: { $regex: new RegExp(`^${categoryName}$`, 'i') } });
      if (!category) {
        category = await Category.create({ name: categoryName });
      }
      updateData.category = category._id;
    }

    const book = await Book.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('author', 'name')
      .populate('category', 'name');

    if (!book) return res.status(404).json({ msg: 'Book not found' });

    res.json(book);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.query;

    let book;

    if (id) {
      book = await Book.findByIdAndDelete(id);
      if (!book) {
        return res.status(404).json({ msg: 'Book not found by ID' });
      }
    } else if (title) {
      book = await Book.findOneAndDelete({
        title: { $regex: new RegExp(`^${title}$`, 'i') }
      });
      if (!book) {
        return res.status(404).json({ msg: 'Book not found by title' });
      }
    } else {
      return res.status(400).json({
        msg: 'Please provide a book ID in the URL or a title as a query parameter'
      });
    }

    res.json({ msg: 'Book deleted successfully', book });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};



