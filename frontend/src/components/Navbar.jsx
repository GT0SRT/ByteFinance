import React, { useState, useRef, useEffect } from 'react';
import { Menu, Coins, User, Edit2, X, ChevronDown, BarChart3 } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Navbar = ({
    view,
    sidebarOpen,
    setSidebarOpen,
    currentChatName,
    dropdownOpen,
    setDropdownOpen,
    renamingChat,
    setRenamingChat,
    newChatName,
    setNewChatName,
    updateChatName,
    currentChatId,
    setShowAnalytics,
    messages
}) => {
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [setDropdownOpen]);

    return (
        <>
            {/* TOP NAVBAR */}
            <nav className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-[rgba(255,215,0,0.1)] bg-black/30 backdrop-blur-sm z-50 overflow-visible">
                {/* Left Section - Menu Button + ByteFinance Logo */}
                <div className="flex items-center gap-4 min-w-fit">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-white/10 rounded transition"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="hidden md:flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[#FFD700]">
                            <Coins />
                        </div>
                        <span className="font-bold text-xl tracking-wide text-white/80">ByteFinance</span>
                    </div>
                </div>

                {/* Center Section - Chat Name with Dropdown Caret */}
                {view === 'chat' && (
                    <div className="flex-1 flex justify-center">
                        <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-sm font-semibold text-gray-200">
                            {currentChatName}
                        </div>
                    </div>
                )}

                {/* Right Section - Profile Icon */}
                <div className="relative min-w-fit" ref={profileRef}>
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="p-2 hover:bg-white/10 rounded transition"
                    >
                        <User size={24} style={{ color: '#FFD700' }} />
                    </button>

                    {/* Profile Dropdown */}
                    {profileOpen && (
                        <div className="absolute top-full right-0 mt-3 w-48 bg-black/95 backdrop-blur-xl border border-[rgba(255,215,0,0.3)] rounded-lg shadow-2xl z-50">
                            <button
                                onClick={() => {
                                    navigate('/profile');
                                    setProfileOpen(false);
                                }}
                                className="w-full text-left px-4 py-3 text-white hover:bg-white/10 transition border-b border-[rgba(255,215,0,0.2)]"
                            >
                                My Profile
                            </button>
                            <button
                                onClick={() => {
                                    signOut(auth);
                                    navigate('/auth');
                                }}
                                className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 transition"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* DROPDOWN PORTAL */}
            {dropdownOpen && view === 'chat' && (
                <div ref={dropdownRef} className="fixed top-20 left-1/2 transform -translate-x-1/2 w-72 max-h-80 overflow-y-auto bg-black/95 backdrop-blur-xl border border-[rgba(255,215,0,0.3)] rounded-lg shadow-2xl z-50">
                    {/* Rename Option */}
                    <div className="p-4 border-b border-[rgba(255,215,0,0.2)]">
                        {renamingChat ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newChatName}
                                    onChange={(e) => setNewChatName(e.target.value)}
                                    placeholder="New name..."
                                    className="flex-1 bg-black/50 text-white p-2 rounded border border-[rgba(255,215,0,0.3)] outline-none focus:border-[#FFD700]"
                                    autoFocus
                                />
                                <button
                                    onClick={() => updateChatName(currentChatId, newChatName || 'New Chat')}
                                    className="px-3 py-2 rounded bg-[#FFD700] text-black font-semibold text-sm hover:bg-yellow-400 transition"
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => {
                                    setRenamingChat(true);
                                    setNewChatName(currentChatName);
                                }}
                                className="w-full flex items-center gap-2 text-gray-300 hover:text-white transition px-2 py-2"
                            >
                                <Edit2 size={16} /> Rename Chat
                            </button>
                        )}
                    </div>

                    {/* View Analytics Button */}
                    <button
                        onClick={() => {
                            setShowAnalytics(true);
                            setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 border-t border-[rgba(255,215,0,0.2)] text-gray-300 hover:text-white hover:bg-white/5 transition flex items-center gap-2 font-semibold"
                    >
                        <BarChart3 size={16} /> View Analytics
                    </button>
                </div>
            )}
        </>
    );
};

export default Navbar;
