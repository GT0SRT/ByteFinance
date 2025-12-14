import React, { useState, useRef, useEffect } from 'react';
import { Send, Home, Briefcase, GraduationCap, Car, TrendingUp, X, Check, Calendar } from 'lucide-react';
import OptionCard from './OptionCard';
import ChatBubble from './ChatBubble';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { auth, db } from '../firebase';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection, doc, setDoc,
  onSnapshot, query, orderBy, getDoc, arrayUnion, serverTimestamp
} from 'firebase/firestore';

const LoanDashboard = () => {
  const [view, setView] = useState('home');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentChatName, setCurrentChatName] = useState('New Chat');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [renamingChat, setRenamingChat] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsChatId, setAnalyticsChatId] = useState(null);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  // --- 1. LISTENER: FETCH ALL CHATS FOR SIDEBAR ---
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const chatsRef = collection(db, 'users', user.uid, 'chatHistory');
        const q = query(chatsRef, orderBy('updatedAt', 'desc'));

        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const loadedChats = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().chatName || 'New Chat',
            updatedAt: doc.data().updatedAt
          }));
          setChatList(loadedChats);
        });
        return () => unsubscribeSnapshot();
      } else {
        setChatList([]);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // --- 2. LISTENER: FETCH MESSAGES FOR CURRENT CHAT ---
  // This fixes the "Not Visible" issue. It listens to the DB directly.
  useEffect(() => {
    if (!currentChatId || !auth.currentUser) return;

    const chatDocRef = doc(db, 'users', auth.currentUser.uid, 'chatHistory', currentChatId);

    const unsubscribe = onSnapshot(chatDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMessages(data.messages || []);
      }
    }, (error) => {
      console.error("Error listening to chat:", error);
    });

    return () => unsubscribe();
  }, [currentChatId]);

  // --- 3. ANALYTICS FETCH ---
  useEffect(() => {
    // Only run if modal is open and we have an ID to look up
    if (showAnalytics && auth.currentUser && analyticsChatId) {
      const fetchAnalytics = async () => {
        try {
          // 1. Get Chat Data (Loan Status) using the SPECIFIC ID
          const chatDoc = await getDoc(doc(db, 'users', auth.currentUser.uid, 'chatHistory', analyticsChatId));
          const chatData = chatDoc.exists() ? chatDoc.data() : {};

          // 2. Get User Data (Profile)
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};

          setAnalyticsData({
            status: chatData.loanStatus || 'INQUIRY',
            amount: chatData.loanAmount || 0,
            scheme: chatData.loanScheme || 'N/A',
            emi: chatData.emiAmount || 0,
            nextEmi: chatData.nextEmiDate || 'TBD',
            tenure: chatData.tenureMonths || 0,
            paidEmis: chatData.paidEmis || 0,

            creditScore: userData.creditScore || 'N/A',
            kycStatus: userData.documents?.panCard ? 'Verified' : 'Pending',
          });
        } catch (e) { console.error(e); }
      };
      fetchAnalytics();
    }
  }, [showAnalytics, analyticsChatId]);

  // --- HELPER: ENSURE CHAT EXISTS ---
  const ensureChatReady = async (seed) => {
    if (!auth.currentUser) return null;

    if (!currentChatId) {
      const newChatId = String(Date.now());
      const name = seed ? `${seed} • ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'New Chat';

      setCurrentChatId(newChatId);
      setCurrentChatName(name);

      // Create doc immediately
      await setDoc(doc(db, 'users', auth.currentUser.uid, 'chatHistory', newChatId), {
        chatId: newChatId,
        chatName: name,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { chatId: newChatId, chatName: name };
    }
    return { chatId: currentChatId, chatName: currentChatName };
  };

  const createNewChat = () => {
    setCurrentChatId(null);
    setCurrentChatName('New Chat');
    setMessages([]);
    setView('home');
    setDropdownOpen(false);
  };

  const switchChat = (chatId, chatName) => {
    setCurrentChatId(chatId);
    setCurrentChatName(chatName);
    setSidebarOpen(false);
    setView('chat');
    // Messages will auto-load via the useEffect listener above
  };

  const updateChatName = async (chatId, newName) => {
    if (auth.currentUser) {
      // Use setDoc with merge to avoid crash if doc missing
      const chatRef = doc(db, 'users', auth.currentUser.uid, 'chatHistory', chatId);
      await setDoc(chatRef, { chatName: newName }, { merge: true });
    }
    setRenamingChat(false);
    setNewChatName('');
    setDropdownOpen(false);
  };

  const handleStartChat = (topic) => {
    setView('chat');
    handleSend(`I want to apply for a ${topic}`);
  };

  // --- MAIN SEND FUNCTION ---
  const handleSend = async (overrideText) => {
    const textToSend = overrideText ?? input;
    if (!textToSend.trim() || isSending) return;

    if (view !== 'chat') setView('chat');
    setIsSending(true);
    setInput('');

    try {
      const chatData = await ensureChatReady(textToSend);
      if (!chatData) return;
      const activeChatId = chatData.chatId;

      const userMsg = {
        id: Date.now(),
        role: 'user',
        text: textToSend,
        timestamp: new Date().toISOString()
      };

      // 1. Optimistic Update (Show immediately)
      setMessages(prev => [...prev, userMsg]);

      // 2. Save User Msg to Firestore
      if (auth.currentUser) {
        const chatRef = doc(db, 'users', auth.currentUser.uid, 'chatHistory', activeChatId);
        await setDoc(chatRef, {
          messages: arrayUnion(userMsg),
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }

      // 3. Call Backend
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/chat`, {
        message: textToSend,
        userId: auth.currentUser?.uid || 'guest',
        chatId: activeChatId
      });

      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: data.response,
        timestamp: new Date().toISOString()
      };

      // 4. Save Bot Msg to Firestore (Listener will update UI, but we can set local too)
      if (auth.currentUser) {
        const chatRef = doc(db, 'users', auth.currentUser.uid, 'chatHistory', activeChatId);
        await setDoc(chatRef, {
          messages: arrayUnion(botMsg),
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } else {
        setMessages(prev => [...prev, botMsg]);
      }

    } catch (err) {
      console.error("Error:", err);
      setMessages(prev => [...prev, { id: Date.now(), role: 'bot', text: "System Error. Is Backend running?" }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-screen bg-black text-white font-sans flex flex-row relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[130px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%)' }} />
      {/* <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[130px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, transparent 70%)' }} /> */}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        chatList={chatList}
        currentChatId={currentChatId}
        createNewChat={createNewChat}
        switchChat={switchChat}
        onRenameChat={updateChatName}
        onShowAnalytics={(chatId) => {
          setAnalyticsChatId(chatId);
          setShowAnalytics(true);
        }}
      />

      <div className="flex-1 flex flex-col h-full relative z-10">
        <Navbar
          view={view}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentChatName={currentChatName}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          renamingChat={renamingChat}
          setRenamingChat={setRenamingChat}
          newChatName={newChatName}
          setNewChatName={setNewChatName}
          updateChatName={(newName) => updateChatName(currentChatId, newName)}
          currentChatId={currentChatId}
          setShowAnalytics={setShowAnalytics}
          messages={messages}
        />

        <main className="flex-1 flex flex-col overflow-hidden relative w-[101vw]">
          {view === 'home' && (
            <div className="flex-1 flex flex-col items-center justify-center animate-fade-in pb-20 px-4 ">
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                How can I help you today?
              </h1>
              <div className="grid grid-cols-2 gap-4 w-full max-w-3xl">
                <OptionCard icon={Home} title="Home Loan" subtext="Check eligibility for ₹50L" onClick={() => handleStartChat('Home Loan')} />
                <OptionCard icon={Briefcase} title="Personal Loan" subtext="Instant approval up to ₹5L" onClick={() => handleStartChat('Personal Loan')} />
                <OptionCard icon={GraduationCap} title="Education Loan" subtext="Study abroad rates" onClick={() => handleStartChat('Education Loan')} />
                <OptionCard icon={Car} title="Car Loan" subtext="New & Used car finance" onClick={() => handleStartChat('Car Loan')} />
              </div>
            </div>
          )}

          {view === 'chat' && (
            <div className="flex-1 flex flex-col relative overflow-hidden">
              <div className="flex-1 overflow-y-auto pr-4 pb-28 pt-22 px-4 [&::-webkit-scrollbar]:hidden">
                {messages.map(msg => (
                  <ChatBubble key={msg.id} {...msg} />
                ))}
                {isSending && (
                  <ChatBubble role="bot" text="..." />
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* INPUT AREA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pt-4 bg-black">
        <div className="w-full md:w-[60%] md:ml-[20%] px-4 pb-6 pointer-events-auto">
          <div className="min-h-[56px] rounded-[24px] flex items-end px-2 py-2 bg-[#0a0a0a] border border-[#FFD700]/30 shadow-[0_0_30px_rgba(0,0,0,0.5)]">

            <textarea
              rows={1}
              placeholder="Type your message..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none px-4 py-3 resize-none max-h-32 overflow-y-auto custom-scrollbar"
              style={{ minHeight: '24px' }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />

            <button
              onClick={() => handleSend()}
              className={`p-3 mb-1 rounded-full transition-all shrink-0 ${input.trim() ? 'bg-[#FFD700] text-black shadow-lg hover:scale-105' : 'bg-white/10 text-gray-400'}`}
            >
              <Send size={18} />
            </button>

          </div>
        </div>
      </div>

      {/* ANALYTICS MODAL */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-[rgba(255,215,0,0.3)] rounded-2xl w-full max-w-2xl overflow-hidden relative shadow-2xl">

            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="text-[#FFD700]" /> Loan Status
                </h2>
                <p className="text-gray-400 text-sm mt-1">Tracking ID: #{analyticsChatId?.slice(-6)}</p>
              </div>
              <button onClick={() => setShowAnalytics(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-8">

              {/* 1. STATUS PIPELINE */}
              <div className="relative">
                <div className="flex justify-between mb-2">
                  {['INQUIRY', 'APPLIED', 'VERIFIED', 'APPROVED'].map((step, idx) => {
                    const steps = ['INQUIRY', 'APPLIED', 'VERIFIED', 'APPROVED'];
                    const currentIdx = steps.indexOf(analyticsData?.status || 'INQUIRY');
                    const isCompleted = idx <= currentIdx;

                    return (
                      <div key={step} className="flex flex-col items-center z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-500
                                      ${isCompleted ? 'bg-[#FFD700] border-[#FFD700] text-black' : 'bg-black border-gray-600 text-gray-600'}`}>
                          {isCompleted ? <Check size={14} /> : idx + 1}
                        </div>
                        <span className={`text-xs mt-2 font-medium ${isCompleted ? 'text-[#FFD700]' : 'text-gray-600'}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {/* Progress Bar Line */}
                <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-800 -z-0">
                  <div
                    className="h-full bg-[#FFD700] transition-all duration-500"
                    style={{ width: `${(['INQUIRY', 'APPLIED', 'VERIFIED', 'APPROVED'].indexOf(analyticsData?.status || 'INQUIRY') / 3) * 100}%` }}
                  />
                </div>
              </div>

              {/* 2. LOAN DETAILS GRID */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Loan Amount</p>
                  <p className="text-2xl font-bold text-white mt-1">₹ {(analyticsData?.amount || 0).toLocaleString()}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Scheme</p>
                  <p className="text-lg font-bold text-[#FFD700] mt-1 truncate">{analyticsData?.scheme}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Status</p>
                  <p className={`text-lg font-bold mt-1 ${analyticsData?.status === 'REJECTED' ? 'text-red-500' : 'text-green-400'}`}>
                    {analyticsData?.status}
                  </p>
                </div>
              </div>

              {/* 3. INSTALLMENT TRACKER (Only if Approved) */}
              {['APPROVED', 'DISBURSED'].includes(analyticsData?.status) && (
                <div className="bg-gradient-to-r from-[rgba(255,215,0,0.1)] to-transparent p-6 rounded-xl border border-[rgba(255,215,0,0.2)]">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-[#FFD700]" /> Repayment Schedule
                  </h3>
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <p className="text-gray-400">Next Installment</p>
                      <p className="text-xl font-bold text-white mt-1">{analyticsData?.nextEmi}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400">EMI Amount</p>
                      <p className="text-xl font-bold text-[#FFD700] mt-1">₹ {analyticsData?.emi}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Paid: {analyticsData?.paidEmis} months</span>
                      <span>Total: {analyticsData?.tenure} months</span>
                    </div>
                    <div className="w-full h-2 bg-black rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FFD700]"
                        style={{ width: `${(analyticsData?.paidEmis / analyticsData?.tenure) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanDashboard;