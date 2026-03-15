import Book from '../models/Book.js';
import Issue from '../models/Issue.js';
import { GoogleGenAI } from '@google/genai';

// @desc    Handle Chatbot Query
// @route   POST /api/chatbot
// @access  Private
export const handleChatQuery = async (req, res) => {
  const { message } = req.body;
  const lowerMsg = message.toLowerCase();

  try {
    // 1. Fetch library context
    const allBooks = await Book.find({});
    const availableBooks = allBooks.filter(b => b.availableCopies > 0).map(b => b.title).join(', ');
    const userIssues = await Issue.find({ user: req.user._id, status: 'Issued' }).populate('book', 'title');
    const dueDates = userIssues.length > 0 
      ? userIssues.map(i => `'${i.book.title}' is due on ${new Date(i.dueDate).toDateString()}`).join(', ')
      : "User has no currently issued books.";

    // 2. Determine if AI is enabled
    const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

    if (ai) {
      // 3a. AI-Powered Response
      const systemPrompt = `You are a helpful and polite librarian assistant for a library management system.
Your job is to answer user questions using the following real-time database context.
If the user asks an unrelated general question, you can still answer it nicely but try to keep things focused on books or knowledge when possible. Keep your answers concise.
---
REAL-TIME DATABASE CONTEXT:
1. Available books in the library right now: ${availableBooks || "None"}
2. The user's borrowings and due dates: ${dueDates}
---
User Question: ${message}`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: systemPrompt
        });
        return res.json({ reply: response.text });
      } catch (aiError) {
        console.error("Gemini AI Error:", aiError);
        return res.json({ reply: "I'm sorry, my AI connection is currently experiencing issues. Please try again later." });
      }
    } else {
      // 3b. Basic Fallback Response
      if (lowerMsg.includes('available books') || lowerMsg.includes('show books')) {
        return res.json({ reply: availableBooks ? `Here are some available books: ${availableBooks}` : 'Sorry, no books are currently available.' });
      } else if (lowerMsg.includes('due date')) {
        return res.json({ reply: userIssues.length > 0 ? dueDates : 'You have no active issued books.' });
      } else {
        return res.json({ reply: "I am a simple librarian bot. Ask me to 'show available books' or 'what is my due date'. To enable my advanced AI so I can answer absolutely anything, an Admin needs to add a GEMINI_API_KEY to the backend .env file!" });
      }
    }
  } catch (err) {
    console.error("Chatbot Controller Error:", err);
    return res.status(500).json({ reply: "Sorry, I'm having trouble accessing my database right now." });
  }
};
