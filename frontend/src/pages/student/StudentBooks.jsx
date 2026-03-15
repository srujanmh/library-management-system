import React, { useState, useEffect, useRef } from 'react';
import StudentLayout from '../../components/layouts/StudentLayout';
import api from '../../services/api';
import { Search, Mic, MicOff, Book as BookIcon } from 'lucide-react';

const StudentBooks = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Setup Speech Recognition
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setSearchTerm(transcript);
                setIsListening(false);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        } else {
            console.warn("Speech recognition not supported in this browser.");
        }
    }, []);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const { data } = await api.get(`/books${searchTerm ? '?keyword=' + searchTerm : ''}`);
                setBooks(data.filter(b => b.availableCopies > 0)); // Only show available to students
            } catch (error) {
                console.error('Error fetching books', error);
            }
        };
        fetchBooks();
    }, [searchTerm]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Voice search is not supported in your browser.");
            return;
        }
        
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    return (
        <StudentLayout>
            <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Find Books</h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="relative max-w-2xl mx-auto flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                            <input
                                type="text"
                                placeholder="Search by title, author, or specify category..."
                                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-indigo-100 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={toggleListening}
                            className={`p-4 rounded-xl flex items-center justify-center transition-all shadow-sm ${
                                isListening 
                                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }`}
                            title="Voice Search"
                        >
                            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                        </button>
                    </div>
                    {isListening && (
                        <p className="text-center text-sm text-red-500 mt-2 font-medium">Listening... Speak now</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {books.map((book) => (
                        <div key={book._id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                            <div className="h-48 bg-indigo-50 flex items-center justify-center border-b border-gray-100">
                                <BookIcon size={64} className="text-indigo-200" />
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">{book.category}</span>
                                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
                                <p className="text-gray-500 text-sm mb-4">by {book.author}</p>
                                <div className="mt-auto">
                                    <p className="text-sm font-medium text-gray-900 flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg">
                                        <span>Copies Available:</span>
                                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">{book.availableCopies}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {books.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500">
                            <div className="inline-block p-4 bg-gray-50 rounded-full mb-3">
                                <Search size={32} className="text-gray-400" />
                            </div>
                            <p className="text-lg font-medium">No books found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
};

export default StudentBooks;
