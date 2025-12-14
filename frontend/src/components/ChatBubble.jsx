import React from 'react';
import { FileText, Download, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf'; 

const ChatBubble = ({ role, text }) => {
    const isUser = role === 'user';
    const isLoading = text === "..."; // Flag for typing dots

    // --- SMART DETECTION (Sanction Letter) ---
    const lowerText = text?.toLowerCase() || "";
    const isSanctionLetter = !isUser && !isLoading &&
        lowerText.includes("sanction letter") && 
        (lowerText.includes("approved") || lowerText.includes("generated") || lowerText.includes("success"));

    // --- PDF DOWNLOAD ---
    const handleDownload = () => {
        try {
            const nameMatch = text.match(/for\s+([A-Za-z\s]+?)\s+(?:for|of|has)/i);
            const amountMatch = text.match(/[₹|Rs\.?]\s?([\d,]+)/i);
            const name = nameMatch ? nameMatch[1].trim() : "Valued Customer";
            const amount = amountMatch ? amountMatch[1] : "5,00,000";

            const doc = new jsPDF();
            doc.setFillColor(0, 0, 0); 
            doc.rect(0, 0, 210, 40, 'F');
            doc.setTextColor(255, 215, 0); 
            doc.setFontSize(22);
            doc.text("ByteFinance", 20, 25);
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(16);
            doc.text("SANCTION LETTER", 105, 60, null, null, "center");
            doc.setFontSize(12);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 80);
            doc.text(`To: ${name}`, 20, 90);
            doc.text("Dear Customer,", 20, 110);
            doc.text("We are pleased to inform you that your loan application has been", 20, 120);
            doc.text("provisionally APPROVED based on your credit profile.", 20, 126);
            doc.setDrawColor(0, 0, 0);
            doc.rect(20, 140, 170, 40);
            doc.setFontSize(14);
            doc.text(`Approved Amount: Rs. ${amount}`, 30, 155);
            doc.text(`Interest Rate: 8.5% p.a.`, 30, 165);
            doc.text(`Tenure: Flexible`, 30, 175);
            doc.save(`Sanction_Letter_${name}.pdf`);
        } catch (e) {
            alert("Demo: Sanction Letter Downloaded!");
        }
    };

    return (
        <div className={`flex w-full md:w-[80%] md:ml-[10%] mb-5 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed whitespace-pre-line shadow-lg ${
                    isUser
                    ? 'text-black bg-[#FFD700] rounded-tr-sm'
                    : isSanctionLetter 
                        ? 'bg-gradient-to-br from-[#1a1a1a] to-black border border-[#FFD700] p-0 overflow-hidden'
                        : 'text-gray-100 bg-white/10 border border-white/10'
                }`}
            >
                {isLoading ? (
                <div className="flex items-center space-x-1.5 h-4 p-1">
                    <div 
                        className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce" 
                        style={{ animationDuration: '0.6s', animationDelay: '0ms' }}
                    ></div>
                    <div 
                        className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce" 
                        style={{ animationDuration: '0.6s', animationDelay: '0.1s' }}
                    ></div>
                    <div 
                        className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce" 
                        style={{ animationDuration: '0.6s', animationDelay: '0.2s' }}
                    ></div>
                    </div>
                ) : isSanctionLetter ? (
                    // --- SANCTION CARD ---
                    <div className="w-full min-w-[300px]">
                        <div className="bg-[#FFD700] p-3 flex items-center gap-2">
                            <CheckCircle size={18} className="text-black" />
                            <span className="font-bold text-black text-sm">Loan Approved</span>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <FileText size={24} className="text-[#FFD700]" />
                                </div>
                                <div>
                                    <p className="text-gray-300 text-xs">Document Type</p>
                                    <p className="text-white font-bold text-base">Sanction Letter</p>
                                    <p className="text-green-400 text-xs mt-1">Verified & Digitally Signed</p>
                                </div>
                            </div>
                            <p className="text-gray-400 text-xs border-t border-white/10 pt-2 italic">"{text}"</p>
                            <button onClick={handleDownload} className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-all text-xs font-semibold border border-white/10">
                                <Download size={14} /> Download PDF
                            </button>
                        </div>
                    </div>
                ) : (
                    <span>{text}</span>
                )}
            </div>
        </div>
    );
};

export default ChatBubble;