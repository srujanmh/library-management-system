import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Camera, Save, User, Mail, Phone, FileText, Award, Star, ArrowLeft, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    profilePicture: '',
  });
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          phone: data.phone || '',
          profilePicture: data.profilePicture || '',
        });
        setPreviewImage(data.profilePicture || '');
      } catch (err) {
        console.error('Error fetching profile', err);
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setFormData(prev => ({ ...prev, profilePicture: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreviewImage('');
    setFormData(prev => ({ ...prev, profilePicture: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const { data } = await api.put('/users/profile', formData);
      updateUser(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    return formData.name ? formData.name.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(user?.role === 'Admin' ? '/admin' : '/student')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-lg font-bold text-gray-900">Edit Profile</h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative group">
            <div
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl cursor-pointer ring-4 ring-indigo-100 transition-all group-hover:ring-indigo-300"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewImage ? (
                <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                  {getInitials()}
                </div>
              )}

              {/* Camera Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <Camera size={28} className="text-white" />
              </div>
            </div>

            {previewImage && (
              <button
                onClick={handleRemoveImage}
                className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Change Profile Photo
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Name */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
              <User size={16} /> Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 font-medium transition-all"
              placeholder="Your full name"
            />
          </div>

          {/* Email (Read Only) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
              <Mail size={16} /> Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              readOnly
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>

          {/* Bio */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
              <FileText size={16} /> Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
              maxLength={150}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 resize-none transition-all"
              placeholder="Write a short bio about yourself..."
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{formData.bio.length}/150</p>
          </div>

          {/* Phone */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
              <Phone size={16} /> Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 font-medium transition-all"
              placeholder="+91 99999 99999"
            />
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-100 mb-4">Your Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
                <Star size={24} className="mx-auto mb-2 text-amber-300" />
                <div className="text-2xl font-bold">{user?.points || 0}</div>
                <div className="text-xs text-indigo-200">Points</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
                <Award size={24} className="mx-auto mb-2 text-amber-300" />
                <div className="text-2xl font-bold">{user?.badges?.length || 0}</div>
                <div className="text-xs text-indigo-200">Badges</div>
              </div>
            </div>
          </div>

          {/* Error / Success */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <X size={16} /> {error}
            </div>
          )}

          {saved && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-pulse">
              <Check size={16} /> Profile updated successfully!
            </div>
          )}

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-base shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={18} /> Save Profile
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
