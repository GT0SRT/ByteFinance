import React, { useState, useRef, useEffect } from 'react';
import { X, MessageSquare, Coins, User, MoreVertical, Edit2, BarChart3, Check, Trash } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ 
    sidebarOpen, 
    setSidebarOpen, 
    chatList, 
    currentChatId, 
    createNewChat, 
    switchChat,
    onRenameChat,      // New Prop
    onShowAnalytics    // New Prop
}) => {
    const navigate = useNavigate();
    const [activeMenuId, setActiveMenuId] = useState(null); // Which 3-dots menu is open?
    const [editingChatId, setEditingChatId] = useState(null); // Which chat is being renamed?
    const [editName, setEditName] = useState("");
    
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        try {
            setSidebarOpen(false);
            await signOut(auth);
            navigate('/');
        } catch (err) {
            console.error('Sign out failed', err);
        }
    };

    const startEditing = (chat) => {
        setEditingChatId(chat.id);
        setEditName(chat.name);
        setActiveMenuId(null); // Close menu
    };

    const saveRename = () => {
        if (editingChatId && editName.trim()) {
            onRenameChat(editingChatId, editName);
        }
        setEditingChatId(null);
    };

    return (
        <>
            <aside className={`h-screen w-72 bg-black/90 backdrop-blur-xl border-r border-[rgba(255,215,0,0.1)] flex flex-col transition-transform duration-300 fixed inset-0 z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                
                {/* Header */}
                <div className="p-5 border-b border-[rgba(255,215,0,0.1)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#FFD700] bg-[rgba(255,215,0,0.1)]">
                            <Coins size={20} />
                        </div>
                        <span className="font-bold text-xl tracking-wide text-white">ByteFinance</span>
                    </div>
                    {/* Close button only on mobile */}
                    <button onClick={() => setSidebarOpen(false)} className=" p-2 hover:bg-white/10 rounded transition text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                {/* New Chat Button */}
                <div className="p-4">
                    <button
                        onClick={() => { window.location.reload(); setSidebarOpen(false); }}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg transition-all font-semibold shadow-[0_0_15px_rgba(255,215,0,0.1)] hover:shadow-[0_0_20px_rgba(255,215,0,0.2)]"
                        style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.2)' }}
                    >
                        <MessageSquare size={18} /> New Chat
                    </button>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-3 mb-2 mt-2">Recent Chats</p>
                    
                    {chatList.map(chat => (
                        <div key={chat.id} className="group relative flex items-center">
                            
                            {editingChatId === chat.id ? (
                                <div className="flex-1 flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-[#FFD700]/50 mx-2">
                                    <input 
                                        autoFocus
                                        type="text" 
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && saveRename()}
                                        className="flex-1 bg-transparent border-none outline-none text-white text-sm"
                                    />
                                    <button onClick={saveRename} className="text-green-400 hover:text-green-300"><Check size={16}/></button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => switchChat(chat.id, chat.name)}
                                    className={`flex-1 text-left p-3 rounded-lg transition-all truncate text-sm flex items-center justify-between pr-8 ${
                                        currentChatId === chat.id
                                            ? 'bg-[rgba(255,215,0,0.15)] text-white border border-[rgba(255,215,0,0.1)]'
                                            : 'hover:bg-white/5 text-gray-400 hover:text-gray-200'
                                    }`}
                                >
                                    <span className="truncate">{chat.name}</span>
                                </button>
                            )}

                            {/* 3-Dots Menu Button */}
                            {!editingChatId && (
                                <div className="absolute right-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMenuId(activeMenuId === chat.id ? null : chat.id);
                                        }}
                                        className={`p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-opacity ${
                                            activeMenuId === chat.id ? 'opacity-100 bg-white/10' : 'md:opacity-0 group-hover:opacity-100'
                                        }`}
                                    >
                                        <MoreVertical size={16} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {activeMenuId === chat.id && (
                                        <div ref={menuRef} className="absolute right-0 top-8 w-40 bg-[#121212] border border-gray-800 rounded-lg shadow-xl z-50 overflow-hidden py-1">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); startEditing(chat); }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-[#FFD700] flex items-center gap-2"
                                            >
                                                <Edit2 size={14} /> Rename
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); onShowAnalytics(chat.id); setActiveMenuId(null); }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-[#FFD700] flex items-center gap-2"
                                            >
                                                <BarChart3 size={14} /> Analytics
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-[rgba(255,215,0,0.1)] space-y-2 bg-black/40">
                    <button onClick={() => { navigate('/profile'); setSidebarOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition">
                        <User size={18} />
                        <span className="text-sm font-medium">My Profile</span>
                    </button>
                    <button onClick={handleSignOut} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition">
                        <Trash size={18} />
                        <span className="text-sm font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Backdrop */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}
        </>
    );
};

export default Sidebar;