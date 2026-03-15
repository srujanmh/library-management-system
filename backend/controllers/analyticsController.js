import Book from '../models/Book.js';
import Issue from '../models/Issue.js';
import User from '../models/User.js';

// @desc    Get dashboard analytics
// @route   GET /api/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
  try {
    const totalBooksCount = await Book.countDocuments();
    const totalUsersCount = await User.countDocuments();
    const totalIssuesCount = await Issue.countDocuments();
    const activeIssuesCount = await Issue.countDocuments({ status: 'Issued' });

    // Category usage
    const categoryUsage = await Book.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Most borrowed books (using issue records)
    const mostBorrowed = await Issue.aggregate([
      { $group: { _id: '$book', timesBorrowed: { $sum: 1 } } },
      { $sort: { timesBorrowed: -1 } },
      { $limit: 5 }
    ]);

    const populatedMostBorrowed = await Book.populate(mostBorrowed, { path: '_id', select: 'title author' });

    res.json({
      totalBooks: totalBooksCount,
      totalUsers: totalUsersCount,
      totalIssues: totalIssuesCount,
      activeIssues: activeIssuesCount,
      categoryUsage,
      mostBorrowed: populatedMostBorrowed
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};
