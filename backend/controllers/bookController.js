import Book from '../models/Book.js';

// @desc    Fetch all books / Search books
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res) => {
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const books = await Book.find({ ...keyword });
  res.json(books);
};

// @desc    Fetch single book
// @route   GET /api/books/:id
// @access  Public
export const getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
};

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Admin
export const createBook = async (req, res) => {
  const { title, author, category, isbn, totalCopies } = req.body;

  const bookExists = await Book.findOne({ isbn });
  if (bookExists) {
    return res.status(400).json({ message: 'Book with this ISBN already exists' });
  }

  const book = new Book({
    title,
    author,
    category,
    isbn,
    totalCopies: totalCopies || 1,
    availableCopies: totalCopies || 1,
  });

  const createdBook = await book.save();
  res.status(201).json(createdBook);
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
export const updateBook = async (req, res) => {
  const { title, author, category, isbn, totalCopies, availableCopies } = req.body;

  const book = await Book.findById(req.params.id);

  if (book) {
    book.title = title || book.title;
    book.author = author || book.author;
    book.category = category || book.category;
    book.isbn = isbn || book.isbn;
    book.totalCopies = totalCopies || book.totalCopies;
    book.availableCopies = availableCopies !== undefined ? availableCopies : book.availableCopies;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
export const deleteBook = async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    await book.deleteOne();
    res.json({ message: 'Book removed' });
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
};
