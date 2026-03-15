import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Book',
  },
  issueDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Issued', 'Returned'],
    default: 'Issued',
  },
  pagesRead: {
    type: Number,
    default: 0,
  },
  totalPages: {
    type: Number,
    default: 100, // Usually populated from books if we tracked total pages
  }
}, {
  timestamps: true,
});

const Issue = mongoose.model('Issue', issueSchema);
export default Issue;
