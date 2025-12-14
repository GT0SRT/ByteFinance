import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Clock, ChevronDown, ChevronUp, Coins } from 'lucide-react';

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How quickly can I get my loan approved?",
      answer: "With our AI-powered system, most loans are approved within 3 minutes. Once approved, funds are typically disbursed within 24 hours to your bank account."
    },
    {
      question: "What documents do I need to apply?",
      answer: "You'll need a valid government ID, proof of income (bank statements or pay stubs), and address proof. Our AI system analyzes these instantly to make a decision."
    },
    {
      question: "What are the interest rates?",
      answer: "Interest rates start from 10.5% per annum and vary based on your credit profile, loan amount, and tenure. Our AI ensures you get the best rate based on your financial situation."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use bank-grade 256-bit encryption and comply with all financial regulations. Your data is never shared with third parties without your consent."
    },
    {
      question: "Can I prepay my loan?",
      answer: "Yes! We encourage prepayment and charge zero prepayment penalties. Our smart advice feature even helps you identify the best times to make prepayments to save on interest."
    },
    {
      question: "What is the maximum loan amount I can get?",
      answer: "You can apply for loans ranging from $1,000 to $50,000. The exact amount depends on your credit profile and repayment capacity, which our AI evaluates instantly."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto z-20 relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[#FFD700]"><Coins /></div>
          <span className="font-bold text-xl tracking-wide text-white">ByteFinance</span>
        </div>
        <button
          onClick={() => navigate('/auth')}
          className="text-sm text-[#FFD700] font-bold transition-colors px-4 py-2 rounded-lg border-2 hover:bg-opacity-90
          hover:bg-[#FFD700] hover:text-black cursor-pointer"
          style={{ borderColor: '#FFD700' }}
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-4 mt-10 z-10 relative max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in-up bg-black/50"
          style={{ borderColor: '#FFD700', color: '#FFD700' }}>
          <Zap size={14} style={{ fill: '#FFD700' }} /> <span className='text-white/80'>AI-Powered Lending v1.0</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
          The Loan That <br /> Understands You.
        </h1>

        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Experience the future of finance with ByteCoders.
          <span className="font-semibold text-[#FFD700]"> Instant approvals</span>,
          <span className="font-semibold text-[#FFD700]"> zero paperwork</span>, and
          <span className="font-semibold text-[#FFD700]"> smart repayment advice</span>—powered by Agentic AI.
        </p>

        <button
          onClick={() => navigate('/app')}
          className="group relative cursor-pointer px-8 py-4 text-black font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105"
          style={{
            backgroundColor: '#FFD700',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 22px rgba(255, 215, 0, 0.8)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)'}
        >
          <span className="relative z-10 flex items-center gap-2">
            Check Eligibility Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 mt-32 z-10 relative pb-20">
        {[
          { icon: Clock, title: "3-Minute Sanction", desc: "From 'Hello' to 'Approved' in record time via AI." },
          { icon: Shield, title: "Bank-Grade Security", desc: "Your data is encrypted and handled by regulated partners." },
          { icon: Zap, title: "Smart Advice", desc: "We don't just lend; we help you save interest on repayments." }
        ].map((feat, i) => (
          <div
            key={i}
            className="border p-8 rounded-3xl transition-all group bg-black/50 hover:bg-black/70"
            style={{
              borderColor: 'rgba(255, 215, 0, 0.6)',
              boxShadow: '0 0 10px rgba(255, 215, 0, 0.1)'
            }}
          // onMouseEnter={(e) => {
          //   e.currentTarget.style.borderColor = '#FFD700';
          //   e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.3)';
          // }}
          // onMouseLeave={(e) => {
          //   e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.2)';
          //   e.currentTarget.style.boxShadow = '0 0 0 rgba(255, 215, 0, 0.1)';
          // }}
          >
            <feat.icon
              className="w-10 h-10 transition-colors mb-4 text-[#FFD700]"
            />
            <h3 className="text-xl font-bold mb-2 text-white">{feat.title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-20 z-10 relative">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-gray-300 mb-12">
          Everything you need to know about ByteFinance
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-2xl overflow-hidden bg-black/50 transition-all"
              style={{
                borderColor: openFaq === index ? '#FFD700' : 'rgba(255, 215, 0, 0.2)',
                boxShadow: openFaq === index ? '0 0 10px rgba(255, 215, 0, 0.2)' : 'none'
              }}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-black/30 transition-colors"
              >
                <span className="font-semibold text-white text-lg pr-4">{faq.question}</span>
                {openFaq === index ? (
                  <ChevronUp size={24} style={{ color: '#FFD700', flexShrink: 0 }} />
                ) : (
                  <ChevronDown size={24} style={{ color: '#FFD700', flexShrink: 0 }} />
                )}
              </button>
              {openFaq === index && (
                <div className="px-6 pb-5 text-gray-300 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-20 py-12 z-10 relative" style={{ borderColor: 'rgba(255, 215, 0, 0.2)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[#FFD700]">
                  <Coins />
                </div>
                <span className="font-bold text-xl tracking-wide text-white">Byte Finance</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                Revolutionizing lending with AI-powered solutions. Fast, secure, and smart financial services for everyone.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 text-lg md:text-sm rounded-full" style={{ backgroundColor: '#FFD700' }}></div>
                Quick Links
              </h4>
              <ul className="space-y-3 text-lg md:text-sm pl-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-all block"
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-all block"
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-all block"
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                  >
                    Loan Calculator
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-all block"
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 text-lg md:text-sm rounded-full" style={{ backgroundColor: '#FFD700' }}></div>
                Legal
              </h4>
              <ul className="space-y-3 text-lg md:text-sm pl-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-all block"
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-all block"
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-all block"
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-all block"
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                  >
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t text-center text-sm text-gray-400" style={{ borderColor: 'rgba(255, 215, 0, 0.1)' }}>
            <p>© 2025 ByteFinance. All rights reserved. | Powered by Agentic AI</p>
          </div>
        </div>
      </footer>

      {/* Background Effects - Golden Neon */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] blur-[150px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.25) 0%, rgba(255, 215, 0, 0.1) 40%, transparent 70%)'
        }}
      />
      <div
        className="absolute top-1/3 right-0 w-[800px] h-[800px] blur-[120px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%)'
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[900px] h-[700px] blur-[130px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.18) 0%, transparent 70%)'
        }}
      />
      <div
        className="absolute top-2/3 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] blur-[140px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, transparent 70%)'
        }}
      />
    </div>
  );
};

export default LandingPage;