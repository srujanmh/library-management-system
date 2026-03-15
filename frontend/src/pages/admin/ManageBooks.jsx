import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import api from '../../services/api';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState({ title: '', author: '', category: '', isbn: '', totalCopies: 1 });

  const fetchBooks = async () => {
    try {
      const { data } = await api.get(`/books${searchTerm ? '?keyword=' + searchTerm : ''}`);
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentBook._id) {
        await api.put(`/books/${currentBook._id}`, currentBook);
      } else {
        await api.post('/books', currentBook);
      }
      setIsModalOpen(false);
      setCurrentBook({ title: '', author: '', category: '', isbn: '', totalCopies: 1 });
      fetchBooks();
    } catch (error) {
      console.error('Error saving book', error);
      alert(error.response?.data?.message || 'Error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/books/${id}`);
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book', error);
      }
    }
  };

  const openModal = (book = null) => {
    if (book) {
      setCurrentBook(book);
    } else {
      setCurrentBook({ title: '', author: '', category: '', isbn: '', totalCopies: 1 });
    }
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Manage Books</h2>
          <button
            onClick={() => openModal()}
            className="bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} /> Add New Book
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search books..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">ISBN</th>
                <th className="px-6 py-4">Available / Total</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {books.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{book.title}</td>
                  <td className="px-6 py-4 text-gray-600">{book.author}</td>
                  <td className="px-6 py-4 text-gray-600">{book.category}</td>
                  <td className="px-6 py-4 text-gray-600">{book.isbn}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      book.availableCopies > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {book.availableCopies} / {book.totalCopies}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center justify-end gap-3 text-gray-400">
                    <button onClick={() => openModal(book)} className="hover:text-primary transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(book._id)} className="hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {books.length === 0 && (
            <div className="p-8 text-center text-gray-500">No books found.</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-6">{currentBook._id ? 'Edit Book' : 'Add New Book'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input required type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary" value={currentBook.title} onChange={e => setCurrentBook({...currentBook, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input required type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary" value={currentBook.author} onChange={e => setCurrentBook({...currentBook, author: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input required type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary" value={currentBook.category} onChange={e => setCurrentBook({...currentBook, category: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                <input required type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary" value={currentBook.isbn} onChange={e => setCurrentBook({...currentBook, isbn: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Copies</label>
                <input required type="number" min="1" className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary" value={currentBook.totalCopies} onChange={e => setCurrentBook({...currentBook, totalCopies: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700">Save Book</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageBooks;
