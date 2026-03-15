import React, { useState, useEffect } from 'react';
import StudentLayout from '../../components/layouts/StudentLayout';
import api from '../../services/api';
import { BookMarked, Calendar, CheckSquare, Clock } from 'lucide-react';

const StudentIssues = () => {
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const { data } = await api.get('/issues/myissues');
                setIssues(data);
            } catch (error) {
                console.error('Error fetching my issues', error);
            }
        };
        fetchIssues();
    }, []);



    return (
        <StudentLayout>
            <div className="p-8 max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">My Borrowing History</h2>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {issues.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                             <BookMarked size={48} className="mx-auto mb-4 opacity-20" />
                             <p className="text-lg">You haven't borrowed any books yet.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 p-4">
                            {issues.map(issue => (
                                <div key={issue._id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-50 rounded-lg transition-colors gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{issue.book?.title}</h3>
                                        <div className="text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-2 mb-3">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} /> Issued: {new Date(issue.issueDate).toLocaleDateString()}
                                            </span>
                                            <span className={`flex items-center gap-1 font-medium ${
                                                new Date(issue.dueDate) < new Date() && issue.status === 'Issued' ? 'text-red-500' : 'text-amber-600'
                                            }`}>
                                                <Clock size={14} /> Due: {new Date(issue.dueDate).toLocaleDateString()}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                                issue.status === 'Returned' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'
                                            }`}>
                                                {issue.status}
                                            </span>
                                        </div>
                                        
                                        {/* Simple Progress Bar - UI Demo */}
                                        {issue.status === 'Issued' && (
                                            <div className="max-w-xs mt-2">
                                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                    <span>Reading Progress</span>
                                                    <span>{issue.pagesRead} / {issue.totalPages} pages</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-indigo-600 h-2 rounded-full transition-all" 
                                                        style={{ width: `${Math.min(100, Math.max(0, (issue.pagesRead / issue.totalPages) * 100))}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="w-full md:w-auto flex flex-row md:flex-col gap-2 justify-end">
                                      {issue.status === 'Issued' ? (
                                           <div className="text-sm text-gray-500 italic bg-gray-100 px-4 py-2 rounded-lg text-center w-full">
                                               Please return to admin desk
                                           </div>
                                      ) : (
                                          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg font-medium justify-center">
                                              <CheckSquare size={18} /> Returned on time
                                          </div>
                                      )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
};

export default StudentIssues;
