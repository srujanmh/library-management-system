import Issue from '../models/Issue.js';
import Book from '../models/Book.js';
import User from '../models/User.js';

// @desc    Issue a book
// @route   POST /api/issues
// @access  Private/Admin
export const issueBook = async (req, res) => {
  const { userId, bookId, dueDate } = req.body;

  const book = await Book.findById(bookId);
  const user = await User.findById(userId);

  if (!book || !user) {
    return res.status(404).json({ message: 'Book or User not found' });
  }

  if (book.availableCopies < 1) {
    return res.status(400).json({ message: 'No copies available' });
  }

  // Check if already issued and not returned
  const existingIssue = await Issue.findOne({ user: userId, book: bookId, status: 'Issued' });
  if (existingIssue) {
    return res.status(400).json({ message: 'User already has this book issued' });
  }

  const issue = new Issue({
    user: userId,
    book: bookId,
    dueDate,
  });

  const createdIssue = await issue.save();

  // Decrease available copies
  book.availableCopies -= 1;
  await book.save();

  res.status(201).json(createdIssue);
};

// @desc    Return a book
// @route   PUT /api/issues/:id/return
// @access  Private/Admin
export const returnBook = async (req, res) => {
  const issue = await Issue.findById(req.params.id);

  if (!issue) {
    return res.status(404).json({ message: 'Issue record not found' });
  }

  if (issue.status === 'Returned') {
    return res.status(400).json({ message: 'Book already returned' });
  }

  issue.status = 'Returned';
  issue.returnDate = Date.now();
  await issue.save();

  const book = await Book.findById(issue.book);
  if (book) {
    book.availableCopies += 1;
    await book.save();
  }

  // Gamification: Add points for returning
  const user = await User.findById(issue.user);
  if (user) {
    user.points += 10; // 10 points for return
    // Simple logic for badges could go here
    if (user.points >= 50 && !user.badges.includes('Beginner Reader')) {
      user.badges.push('Beginner Reader');
    }
    await user.save();
  }

  res.json({ message: 'Book returned successfully', issue });
};

// @desc    Get all active issues for a user
// @route   GET /api/issues/myissues
// @access  Private
export const getMyIssues = async (req, res) => {
  const issues = await Issue.find({ user: req.user._id }).populate('book', 'title author category');
  res.json(issues);
};

// @desc    Get all issues
// @route   GET /api/issues
// @access  Private/Admin
export const getIssues = async (req, res) => {
  const issues = await Issue.find({}).populate('user', 'name email').populate('book', 'title isbn');
  res.json(issues);
};
