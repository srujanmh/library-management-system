import React, { useEffect, useState } from 'react';
import StudentLayout from '../../components/layouts/StudentLayout';
import api from '../../services/api';
import { Trophy, BookOpen, Star, Target } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ active: 0, total: 0 });
    const [profile, setProfile] = useState(user);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const issuesRes = await api.get('/issues/myissues');
                const active = issuesRes.data.filter(i => i.status === 'Issued').length;
                setStats({ active, total: issuesRes.data.length });
                
                const profileRes = await api.get('/users/profile');
                setProfile(profileRes.data);
            } catch (err) {
                console.error('Error fetching student stats', err);
            }
        };
        fetchUserData();
    }, []);

    return (
        <StudentLayout>
            <div className="p-8">
                <div className="bg-indigo-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
                    <h2 className="text-3xl font-bold mb-2">Welcome back, {profile?.name}! 👋</h2>
                    <p className="text-indigo-200">Keep reading to earn more points and badges.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                            <Trophy className="text-amber-500" size={32} />
                        </div>
                        <h3 className="text-4xl font-bold text-gray-900 mb-1">{profile?.points || 0}</h3>
                        <p className="text-gray-500 font-medium text-sm text-center">Reading Points</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                            <BookOpen className="text-blue-500" size={32} />
                        </div>
                        <h3 className="text-4xl font-bold text-gray-900 mb-1">{stats.active}</h3>
                        <p className="text-gray-500 font-medium text-sm text-center">Currently Borrowed</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                            <Target className="text-green-500" size={32} />
                        </div>
                        <h3 className="text-4xl font-bold text-gray-900 mb-1">{stats.total}</h3>
                        <p className="text-gray-500 font-medium text-sm text-center">Total Books Read</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Star className="text-amber-400" /> Your Badges
                    </h3>
                    
                    {profile?.badges?.length > 0 ? (
                        <div className="flex flex-wrap gap-4">
                            {profile.badges.map((badge, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-50 border border-amber-200 px-4 py-2 rounded-lg">
                                    <Trophy size={18} className="text-amber-600" />
                                    <span className="font-medium text-amber-900">{badge}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Trophy className="text-gray-300" size={24} />
                            </div>
                            <p className="text-gray-500">You haven't earned any badges yet. Borrow and return books to earn points!</p>
                        </div>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
};

export default StudentDashboard;
