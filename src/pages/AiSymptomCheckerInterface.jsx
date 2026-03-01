import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import TopHeader from '../components/TopHeader';
import Footer from '../components/Footer';

const AiSymptomCheckerInterface = () => {
    // Current application state ('specialist_selection' or 'active_chat')
    const [viewState, setViewState] = useState('specialist_selection');
    const [activeSpecialist, setActiveSpecialist] = useState(null);

    // Chat State
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef(null);

    // Array of available specialists
    const specialists = [
        { id: 'cardiologist', name: 'Cardiologist AI', description: 'Heart health assessment and cardiovascular risk analysis.', icon: 'monitor_heart', color: 'blue', isTrending: true },
        { id: 'neurologist', name: 'Neurologist AI', description: 'Expertise in brain, spine, and nervous system disorders.', icon: 'psychiatry', color: 'purple' },
        { id: 'orthopedic', name: 'Orthopedic AI', description: 'Diagnosis of musculoskeletal systems, joints, and bones.', icon: 'skeleton', color: 'amber' },
        { id: 'ophthalmologist', name: 'Ophthalmologist AI', description: 'Specialized vision care and ocular health examinations.', icon: 'visibility', color: 'blue' },
        { id: 'physician', name: 'General Physician AI', description: 'Comprehensive primary care for overall wellness concerns.', icon: 'medical_services', color: 'blue' },
        { id: 'dermatologist', name: 'Dermatologist AI', description: 'Diagnosis and treatment of skin, hair, and nail conditions.', icon: 'dermatology', color: 'pink' },
        { id: 'radiologist', name: 'Radiologist AI', description: 'Advanced analysis of medical imaging and scan results.', icon: 'radiology', color: 'purple' },
        { id: 'urologist', name: 'Urologist AI', description: 'Urinary tract and male reproductive system specialist.', icon: 'water_drop', color: 'amber' },
    ];

    useEffect(() => {
        if (viewState === 'active_chat') {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping, viewState]);

    const startConsultation = (specialist) => {
        setActiveSpecialist(specialist);
        setMessages([
            {
                role: 'ai',
                content: `Hello. I am the virtual ${specialist.name} assistant. Please describe the exact symptoms you are experiencing, and I'll analyze them for you.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]);
        setViewState('active_chat');
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMsgContent = inputValue.trim();
        const newMessage = {
            role: 'user',
            content: userMsgContent,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue("");
        setIsTyping(true);

        // API Call Integration
        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

            if (!apiKey) {
                throw new Error("API Key Missing");
            }

            const prompt = `You are an AI acting as a highly professional ${activeSpecialist.name} for the ArogyaSetu project. 
CRITICAL RULE 1: You are strictly a medical/health assistant. You MUST ONLY answer questions that are directly related to the health domain.
CRITICAL RULE 2: You MUST ONLY answer questions that are directly related to your specific medical specialty (${activeSpecialist.name}). If the user asks a health question that is outside of your specific medical domain (e.g., asking a Cardiologist about broken bones, or an Ophthalmologist about skin rashes), politely inform them to return to the dashboard to select the correct specialist, and you MUST refuse to answer the question.
If the user asks ANY question outside of the health domain entirely (e.g. general knowledge, coding, politics), firmly refuse to answer.
Do not prescribe serious medication. Answer in extremely short and concise sentences. 
The patient says: "${userMsgContent}"`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            if (!response.ok) throw new Error("API Failure");

            const data = await response.json();
            const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to analyze right now.";

            setMessages(prev => [...prev, {
                role: 'ai',
                content: aiResponseText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);

        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: "I am currently unable to connect to the medical AI network. Please try again later.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const resetSession = () => {
        if (window.confirm("Are you sure you want to exit the current consultation?")) {
            setViewState('specialist_selection');
            setActiveSpecialist(null);
            setMessages([]);
            setInputValue("");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-display text-slate-900 antialiased flex flex-col p-4 sm:p-6 lg:p-8">

            {/* Header */}
            <TopHeader />

            {/* View State 1: Specialist Selection */}
            {viewState === 'specialist_selection' && (
                <div className="flex-1 max-w-6xl mx-auto w-full flex flex-col items-center">

                    <div className="text-center mb-12 max-w-2xl mt-4">
                        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">Choose Your AI Specialist</h2>
                        <p className="text-slate-500 text-[15px] leading-relaxed">
                            Connect with our domain-specific AI medical agents for precision diagnosis and personalized health guidance.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-12">
                        {specialists.map(specialist => (
                            <div
                                key={specialist.id}
                                className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-6 flex flex-col transition-all duration-300 group shadow-sm hover:shadow-md hover:-translate-y-1"
                            >
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-5 border shadow-sm ${specialist.color === 'blue' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                    specialist.color === 'purple' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                        specialist.color === 'pink' ? 'bg-pink-50 text-pink-600 border-pink-100' :
                                            'bg-amber-50 text-amber-600 border-amber-100'
                                    }`}>
                                    <span className="material-symbols-outlined">{specialist.icon}</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{specialist.name}</h3>
                                <p className="text-sm text-slate-500 mb-6 flex-1 line-clamp-3">{specialist.description}</p>

                                <button
                                    onClick={() => startConsultation(specialist)}
                                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors"
                                >
                                    Consult Now
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
                        <span className="material-symbols-outlined text-amber-500 mt-1">warning</span>
                        <div className="flex flex-col">
                            <h4 className="text-slate-900 text-sm font-bold mb-1">Medical Disclaimer</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Arogya Setu AI Specialist agents provide insights based on medical data models but are NOT a substitute for professional medical advice from a qualified healthcare provider. Do not disregard professional advice because of something you have read here. In case of emergency, immediately contact your local emergency response services.
                            </p>
                        </div>
                    </div>

                </div>
            )}

            {/* View State 2: Active Chat Interface */}
            {viewState === 'active_chat' && activeSpecialist && (
                <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

                    {/* Left Panel: Context & Tracking */}
                    <div className="hidden lg:flex w-80 flex-col gap-6">

                        {/* Active Specialist Card */}
                        <div className="bg-white border-2 border-blue-500 rounded-2xl p-6 relative overflow-hidden shadow-sm shadow-blue-600/5">
                            <div className="absolute top-0 right-0 py-1 px-3 bg-blue-600 text-[10px] font-black tracking-wider text-white rounded-bl-xl uppercase">Active</div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center border shadow-sm ${activeSpecialist.color === 'blue' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                    activeSpecialist.color === 'purple' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                        activeSpecialist.color === 'pink' ? 'bg-pink-50 text-pink-600 border-pink-100' :
                                            'bg-amber-50 text-amber-600 border-amber-100'
                                    }`}>
                                    <span className="material-symbols-outlined text-2xl">{activeSpecialist.icon}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 leading-tight">{activeSpecialist.name}</h3>
                                    <span className="text-xs text-blue-600 font-medium tracking-wide">In Progress</span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500">{activeSpecialist.description}</p>
                        </div>

                        {/* Analysis Card */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-6">
                                <span className="material-symbols-outlined text-slate-400 text-[18px]">analytics</span>
                                Active Diagnosis
                            </h4>
                            <div className="flex justify-center mb-6">
                                <div className="relative h-32 w-32 flex items-center justify-center">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-100" />
                                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray="351.858" strokeDashoffset={351.858 * (1 - 0.84)} className="text-rose-500" strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="text-3xl font-black text-slate-900">84%</span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Confidence</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 text-center leading-relaxed">
                                {activeSpecialist.name.replace(' AI', '')} AI is evaluating current symptoms and analyzing historical patterns.
                            </p>
                        </div>
                    </div>

                    {/* Right Panel: Chat Interface */}
                    <div className="flex-1 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-lg relative">

                        {/* Chat Top Bar */}
                        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100 bg-white z-10">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className={`h-10 w-10 flex items-center justify-center rounded-lg text-white ${activeSpecialist.color === 'blue' ? 'bg-blue-600' : activeSpecialist.color === 'purple' ? 'bg-purple-600' : activeSpecialist.color === 'pink' ? 'bg-pink-600' : 'bg-amber-600'}`}>
                                        <span className="material-symbols-outlined">{activeSpecialist.icon}</span>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-900 text-sm">{activeSpecialist.name}</span>
                                    <span className="text-[10px] text-green-500 font-bold tracking-wider uppercase">Active Consultation</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors">
                                    <span className="material-symbols-outlined text-[14px]">history</span>
                                    History
                                </button>
                                <button onClick={resetSession} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition-colors">
                                    <span className="material-symbols-outlined text-[14px]">power_settings_new</span>
                                    End
                                </button>
                            </div>
                        </div>

                        {/* Chat History */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-6 scroll-smooth bg-slate-50/50">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2`}>

                                    <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white ${msg.role === 'ai'
                                        ? (activeSpecialist.color === 'blue' ? 'bg-blue-600' : activeSpecialist.color === 'purple' ? 'bg-purple-600' : activeSpecialist.color === 'pink' ? 'bg-pink-600' : 'bg-amber-600')
                                        : 'bg-slate-200 overflow-hidden'
                                        }`}>
                                        {msg.role === 'ai' ? (
                                            <span className="material-symbols-outlined text-[16px]">{activeSpecialist.icon}</span>
                                        ) : (
                                            <img src="https://i.pravatar.cc/150?img=11" alt="User" />
                                        )}
                                    </div>

                                    <div className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[75%]`}>
                                        <div className={`flex items-center gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                            <span className="text-[10px] text-slate-500 font-bold">{msg.role === 'ai' ? activeSpecialist.name : 'You'} • {msg.timestamp}</span>
                                        </div>
                                        <div className={`p-4 text-[14px] leading-relaxed shadow-sm ${msg.role === 'user'
                                            ? 'bg-blue-600 border border-blue-500 text-white rounded-2xl rounded-tr-sm'
                                            : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>

                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex gap-4 animate-in fade-in">
                                    <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white ${activeSpecialist.color === 'blue' ? 'bg-blue-600' : activeSpecialist.color === 'purple' ? 'bg-purple-600' : activeSpecialist.color === 'pink' ? 'bg-pink-600' : 'bg-amber-600'}`}>
                                        <span className="material-symbols-outlined text-[16px]">{activeSpecialist.icon}</span>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2 shadow-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={bottomRef} className="h-2"></div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 sm:p-6 pt-0 bg-transparent relative z-10 mt-auto">
                            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-2 pl-4 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 shadow-sm overflow-hidden transition-all">
                                <span className="material-symbols-outlined text-slate-400 shrink-0">attach_file</span>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Describe your symptoms in detail..."
                                    className="flex-1 bg-transparent border-none text-slate-900 text-sm focus:ring-0 placeholder:text-slate-400 py-2 outline-none"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || isTyping}
                                    className="h-10 w-10 shrink-0 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-slate-300 flex items-center justify-center text-white transition-all shadow-md"
                                >
                                    <span className="material-symbols-outlined text-lg">send</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* Footer */}
            <Footer />

        </div>
    );
};

export default AiSymptomCheckerInterface;
