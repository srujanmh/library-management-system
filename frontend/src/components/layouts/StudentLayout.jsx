import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, BookOpen, Clock, Calendar, Bookmark, BarChart2, UserCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const StudentLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/student', icon: BarChart2 },
    { name: 'Search Books', path: '/student/books', icon: BookOpen },
    { name: 'My Borrowings', path: '/student/borrowings', icon: Clock },
    { name: 'Seat Booking', path: '/student/seats', icon: Calendar },
    { name: 'My Profile', path: '/profile', icon: UserCircle },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-indigo-800">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Bookmark className="text-indigo-400" /> Student Portal
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
                  isActive ? 'bg-indigo-600 text-white' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-indigo-800">
          <div className="flex items-center gap-3 mb-4 text-sm text-indigo-200">
            <div className="w-8 h-8 rounded-full bg-indigo-800 flex items-center justify-center font-bold text-white shadow-inner overflow-hidden">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0)
              )}
            </div>
            <div>
              <p className="font-medium text-white">{user?.name}</p>
              <div className="flex gap-1 mt-0.5">
                 <span className="text-xs bg-amber-500 text-amber-900 px-1.5 py-0.5 rounded font-medium">{user?.points || 0} pts</span>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 text-indigo-200 hover:text-red-300 py-2 rounded-lg transition-colors hover:bg-indigo-800"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto relative">
        {children}
      </main>
    </div>
  );
};

export default StudentLayout;
