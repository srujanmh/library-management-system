import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Book from './models/Book.js';
import Issue from './models/Issue.js';
import SeatBooking from './models/SeatBooking.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const seedDatabase = async () => {
  try {
    // Clear Existing Data
    await User.deleteMany();
    await Book.deleteMany();
    await Issue.deleteMany();
    await SeatBooking.deleteMany();

    // Create Admin User
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@library.com',
      password: 'admin123',
      role: 'Admin'
    });

    // Create Student Users
    const student1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'student123',
      role: 'Student',
      points: 120,
      badges: ['Beginner Reader', 'Bookworm']
    });
    const student2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'student123',
      role: 'Student',
      points: 15,
      badges: []
    });

    // Create Books
    const booksData = [
      { title: 'The Pragmatic Programmer', author: 'Andy Hunt', category: 'Programming', isbn: '978-0135957059', totalCopies: 3, availableCopies: 2 },
      { title: 'Clean Code', author: 'Robert C. Martin', category: 'Programming', isbn: '978-0132350884', totalCopies: 5, availableCopies: 5 },
      { title: 'Dune', author: 'Frank Herbert', category: 'Science Fiction', isbn: '978-0441172719', totalCopies: 4, availableCopies: 3 },
      { title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Fantasy', isbn: '978-0547928227', totalCopies: 2, availableCopies: 1 },
      { title: 'Design Patterns', author: 'Erich Gamma', category: 'Programming', isbn: '978-0201633610', totalCopies: 3, availableCopies: 3 },
      { title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History', isbn: '978-0062316097', totalCopies: 4, availableCopies: 4 },
    ];
    
    const createdBooks = await Book.insertMany(booksData);

    // Create active issue for student 1 (The Pragmatic Programmer)
    const progBook = await Book.findOne({ isbn: '978-0135957059' });
    await Issue.create({
      user: student1._id,
      book: progBook._id,
      issueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // due in 7 days
      status: 'Issued',
      pagesRead: 154,
      totalPages: 320
    });

    // Create active issue for student 1 (The Hobbit)
    const hobbitBook = await Book.findOne({ isbn: '978-0547928227' });
    await Issue.create({
      user: student1._id,
      book: hobbitBook._id,
      issueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // OVERDUE
      status: 'Issued',
      pagesRead: 50,
      totalPages: 310
    });

    // Create active issue for student 2 (Dune)
    const duneBook = await Book.findOne({ isbn: '978-0441172719' });
    await Issue.create({
      user: student2._id,
      book: duneBook._id,
      issueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000), 
      status: 'Issued',
      pagesRead: 10,
      totalPages: 800
    });

    // Create historical returned issue
    await Issue.create({
      user: student1._id,
      book: duneBook._id,
      issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), 
      returnDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
      status: 'Returned',
      pagesRead: 800,
      totalPages: 800
    });

    // Create Seat Booking today
    const today = new Date().toISOString().split('T')[0];
    await SeatBooking.create({
        user: student1._id,
        seatNumber: 12,
        date: today,
        timeSlot: '11:00 AM - 01:00 PM',
        status: 'Booked'
    });

    console.log('Database Seeded Successfully!');
    process.exit(0);

  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
