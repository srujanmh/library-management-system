import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import api from '../../services/api';
import { Search, Trash2, User as UserIcon, Shield, ShieldAlert } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user', error);
      }
    }
  };

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'Admin' ? 'Student' : 'Admin';
    if (window.confirm(`Are you sure you want to change this user to ${newRole}?`)) {
      try {
        await api.put(`/users/${id}/role`, { role: newRole });
        fetchUsers();
      } catch (error) {
        console.error('Error updating user role', error);
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Manage Users</h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Points</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <UserIcon size={16} />
                    </div>
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.points || 0}</td>
                  <td className="px-6 py-4 flex items-center justify-end gap-3 text-gray-400">
                    <button 
                      onClick={() => toggleRole(user._id, user.role)}
                      className={`transition-colors ${user.role === 'Admin' ? 'hover:text-amber-500' : 'hover:text-purple-500'}`}
                      title={user.role === 'Admin' ? "Demote to Student" : "Promote to Admin"}
                    >
                      {user.role === 'Admin' ? <ShieldAlert size={18} /> : <Shield size={18} />}
                    </button>
                    <button 
                      onClick={() => handleDelete(user._id)} 
                      className="hover:text-red-500 transition-colors"
                      disabled={user.role === 'Admin'} // Prevent deleting other admins blindly
                      title={user.role === 'Admin' ? "Cannot delete admin" : "Delete User"}
                    >
                      <Trash2 size={18} className={user.role === 'Admin' ? 'opacity-50' : ''} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-gray-500">No users found.</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;
