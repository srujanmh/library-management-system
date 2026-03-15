import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import api from '../../services/api';
import { BookUp, BookDown } from 'lucide-react';

const ManageIssues = () => {
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newIssue, setNewIssue] = useState({ userId: '', bookId: '', dueDate: '' });

  const fetchIssues = async () => {
    try {
      const { data } = await api.get('/issues');
      setIssues(data);
    } catch (error) {
      console.error('Error fetching issues', error);
    }
  };

  const fetchUsersAndBooks = async () => {
    try {
      const [usersRes, booksRes] = await Promise.all([
        api.get('/users'),
        api.get('/books')
      ]);
      setUsers(usersRes.data);
      setBooks(booksRes.data.filter(b => b.availableCopies > 0)); // Only show available
    } catch (error) {
      console.error('Error fetching data for issue form', error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchIssues();
    fetchUsersAndBooks();
  }, []);

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      await api.post('/issues', newIssue);
      setIsModalOpen(false);
      setNewIssue({ userId: '', bookId: '', dueDate: '' });
      fetchIssues();
      fetchUsersAndBooks(); // Refresh available count
    } catch (error) {
      alert(error.response?.data?.message || 'Error issuing book');
    }
  };

  const handleReturn = async (issueId) => {
    if (window.confirm('Confirm book return?')) {
      try {
        await api.put(`/issues/${issueId}/return`);
        fetchIssues();
        fetchUsersAndBooks();
      } catch (error) {
        alert(error.response?.data?.message || 'Error returning book');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Issue / Return Books</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <BookUp size={20} /> Issue Book
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Book Details</th>
                <th className="px-6 py-4">Issue Date</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {issues.map((issue) => (
                <tr key={issue._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{issue.user?.name}</p>
                    <p className="text-xs text-gray-500">{issue.user?.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{issue.book?.title}</p>
                    <p className="text-xs text-gray-500">ISBN: {issue.book?.isbn}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{new Date(issue.issueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className={new Date(issue.dueDate) < new Date() && issue.status === 'Issued' ? 'text-red-500 font-medium' : ''}>
                      {new Date(issue.dueDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      issue.status === 'Issued' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-end">
                    {issue.status === 'Issued' && (
                      <button
                        onClick={() => handleReturn(issue._id)}
                        className="text-sm border border-primary text-primary hover:bg-primary hover:text-white px-3 py-1 rounded-md transition-colors flex items-center gap-1"
                      >
                        <BookDown size={14} /> Mark Returned
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {issues.length === 0 && <div className="p-8 text-center text-gray-500">No issue records found.</div>}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-6">Issue Book to User</h3>
            <form onSubmit={handleIssue} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
                <select required className="w-full px-3 py-2 border rounded-lg" value={newIssue.userId} onChange={e => setNewIssue({...newIssue, userId: e.target.value})}>
                  <option value="">-- Select Member --</option>
                  {users.filter(u => u.role !== 'Admin').map(user => (
                    <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Book</label>
                <select required className="w-full px-3 py-2 border rounded-lg" value={newIssue.bookId} onChange={e => setNewIssue({...newIssue, bookId: e.target.value})}>
                  <option value="">-- Select Available Book --</option>
                  {books.map(book => (
                    <option key={book._id} value={book._id}>{book.title} ({book.availableCopies} available)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input required type="date" className="w-full px-3 py-2 border rounded-lg" value={newIssue.dueDate} onChange={e => setNewIssue({...newIssue, dueDate: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700">Issue Book</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageIssues;
