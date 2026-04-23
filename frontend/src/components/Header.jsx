import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const isLoggedIn = !!userInfo;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        setIsDropdownOpen(false);
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side */}
                    <div className="flex items-center space-x-6">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-[#0047fb] font-bold text-2xl tracking-tighter">TaskDone</span>
                        </Link>

                        <nav className="hidden md:flex space-x-6 items-center">
                            <Link to="/post-task" className="bg-[#0047fb] text-white px-4 py-1.5 rounded-full font-semibold text-sm hover:bg-blue-700 transition">
                                Post a task
                            </Link>
                            
                            {isLoggedIn ? (
                                <>
                                    <Link to="/tasks" className="text-[#001D4A] hover:text-[#0047fb] text-sm font-medium">Browse tasks</Link>
                                    <Link to="/my-tasks" className="text-[#001D4A] hover:text-[#0047fb] text-sm font-medium">My tasks</Link>
                                </>
                            ) : (
                                <>
                                    <a href="#" className="text-[#001D4A] hover:text-[#0047fb] text-sm font-medium">Categories</a>
                                    <Link to="/tasks" className="text-[#001D4A] hover:text-[#0047fb] text-sm font-medium">Browse tasks</Link>
                                    <a href="#" className="text-[#001D4A] hover:text-[#0047fb] text-sm font-medium">How it works</a>
                                </>
                            )}
                        </nav>
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center space-x-6">
                        {isLoggedIn ? (
                            <>
                                <a href="#" className="text-[#001D4A] hover:text-[#0047fb] text-sm font-medium">Help</a>
                                <a href="#" className="text-[#001D4A] hover:text-[#0047fb] text-sm font-medium">Notifications</a>
                                <a href="#" className="text-[#001D4A] hover:text-[#0047fb] text-sm font-medium">Messages</a>
                                
                                {/* Avatar Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button 
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f3f6ff] text-[#0047fb] hover:bg-[#e6edff] transition focus:outline-none overflow-hidden"
                                    >
                                        {userInfo.avatar ? (
                                            <img src={userInfo.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                        )}
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fade-in">
                                            <div className="px-4 py-2 mb-2">
                                                <p className="text-sm font-bold text-[#001D4A]">{userInfo.firstName} {userInfo.lastName}</p>
                                                <p className="text-xs text-gray-400 font-medium">Public Profile</p>
                                            </div>
                                            
                                            <div className="border-b border-gray-100 mb-2"></div>
                                            
                                            <a href="#" className="block px-4 py-2.5 text-sm text-[#001D4A] font-medium hover:bg-gray-50">My Tasker Dashboard</a>
                                            <a href="#" className="block px-4 py-2.5 text-sm text-[#001D4A] font-medium hover:bg-gray-50">Payment history</a>
                                            <a href="#" className="block px-4 py-2.5 text-sm text-[#001D4A] font-medium hover:bg-gray-50">Payment methods</a>
                                            
                                            <a href="#" className="block px-4 py-2.5 text-sm text-[#001D4A] font-medium hover:bg-gray-50 flex justify-between items-center">
                                                Settings
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                            </a>
                                            <a href="#" className="block px-4 py-2.5 text-sm text-[#001D4A] font-medium hover:bg-gray-50 flex justify-between items-center">
                                                Discover
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                            </a>
                                            <a href="#" className="block px-4 py-2.5 text-sm text-[#001D4A] font-medium hover:bg-gray-50 flex justify-between items-center">
                                                Help topics
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                            </a>
                                            
                                            <button 
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2.5 text-sm text-[#001D4A] font-medium hover:bg-gray-50 mt-2"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/signup" className="text-[#001D4A] hover:text-[#0047fb] text-sm font-medium">Sign up</Link>
                                <Link to="/login" className="text-[#001D4A] hover:text-[#0047fb] text-sm font-medium">Log in</Link>
                                <Link to="/earn-money" className="text-[#0047fb] border-2 border-gray-200 px-4 py-1.5 rounded-full font-bold text-sm hover:border-[#0047fb] transition">
                                    Become a Tasker
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
