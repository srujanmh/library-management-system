import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, BookOpen, Users, ClipboardList, LayoutDashboard, Settings, UserCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Books', path: '/admin/books', icon: BookOpen },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Issue/Return', path: '/admin/issues', icon: ClipboardList },
    { name: 'My Profile', path: '/profile', icon: UserCircle },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="text-primary" /> Library Admin
          </h1>
        </div>
        
        <nav className="flex-1 py-4 space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 text-sm text-slate-300">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white overflow-hidden">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0)
              )}
            </div>
            <div>
              <p className="font-medium text-white">{user?.name}</p>
              <p className="text-xs">Administrator</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 text-slate-300 hover:text-red-400 py-2 rounded-lg transition-colors hover:bg-slate-800"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
