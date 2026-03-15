import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ManageBooks from './pages/admin/ManageBooks';
import ManageIssues from './pages/admin/ManageIssues';
import ManageUsers from './pages/admin/ManageUsers';
import StudentDashboard from './pages/student/Dashboard';
import StudentBooks from './pages/student/StudentBooks';
import StudentSeats from './pages/student/StudentSeats';
import StudentIssues from './pages/student/StudentIssues';
import Profile from './pages/Profile';
import Chatbot from './components/Chatbot';

const AppContent = () => {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/admin" element={
            <PrivateRoute requiredRole="Admin"><AdminDashboard /></PrivateRoute>
          } />
          
          <Route path="/admin/books" element={
            <PrivateRoute requiredRole="Admin"><ManageBooks /></PrivateRoute>
          } />
          
          <Route path="/admin/issues" element={
            <PrivateRoute requiredRole="Admin"><ManageIssues /></PrivateRoute>
          } />

          <Route path="/admin/users" element={
            <PrivateRoute requiredRole="Admin"><ManageUsers /></PrivateRoute>
          } />

          <Route path="/student" element={
            <PrivateRoute requiredRole="Student"><StudentDashboard /></PrivateRoute>
          } />
          
          <Route path="/student/books" element={
            <PrivateRoute requiredRole="Student"><StudentBooks /></PrivateRoute>
          } />
          
          <Route path="/student/seats" element={
            <PrivateRoute requiredRole="Student"><StudentSeats /></PrivateRoute>
          } />
          
          <Route path="/student/borrowings" element={
            <PrivateRoute requiredRole="Student"><StudentIssues /></PrivateRoute>
          } />

          {/* Profile route for all logged-in users */}
          <Route path="/profile" element={
            user ? <Profile /> : <Navigate to="/login" />
          } />

          {/* Root redirect based on role */}
          <Route path="/" element={
            user ? (
              <Navigate to={user.role === 'Admin' ? '/admin' : '/student'} />
            ) : (
              <Navigate to="/login" />
            )
          } />
        </Routes>
        
        {/* Global Chatbot for logged-in users */}
        {user && <Chatbot />}
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
