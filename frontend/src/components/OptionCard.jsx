import React from 'react';

const OptionCard = ({ icon: Icon, title, subtext, onClick }) => (
    <div
        onClick={onClick}
        className="border p-4 rounded-xl cursor-pointer transition-all duration-200 group bg-black/40 hover:bg-black/50"
        style={{
            borderColor: 'rgba(255, 215, 0, 0.18)',
            boxShadow: '0 0 12px rgba(255, 215, 0, 0.08)'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#FFD700';
            e.currentTarget.style.boxShadow = '0 0 18px rgba(255, 215, 0, 0.25)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.18)';
            e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 215, 0, 0.08)';
        }}
    >
        <div
            className="w-9 h-9 rounded-full flex items-center justify-center mb-3 transition-all"
            style={{
                backgroundColor: 'rgba(255, 215, 0, 0.08)',
                border: '1px solid rgba(255, 215, 0, 0.25)'
            }}
        >
            <Icon className="w-5 h-5" style={{ color: '#FFD700' }} />
        </div>
        <h3 className="text-white font-semibold text-base mb-0.5">{title}</h3>
        <p className="text-gray-400 text-xs">{subtext}</p>
    </div>
);

export default OptionCard;
