import React, { useState, useEffect } from 'react';
import { patientProfileService } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import HeaderActions from '../components/HeaderActions';
import { useAuth } from '../context/AuthContext';


const MainWellnessDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState({ name: user?.name || "Loading...", role: "Loading..." });

    useEffect(() => {
        const fetchProfile = async () => {
            const data = await patientProfileService.getProfile();
            setProfile({ name: user?.name || data.name, role: 'Pro Member' });
        };
        fetchProfile();
    }, []);

    return (
        <>
            <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
                <div className="flex h-screen overflow-hidden">
                    <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                        <Link to="/dashboard" className="p-6 flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white">
                                <span className="material-symbols-outlined">health_and_safety</span>
                            </div>
                            <div>
                                <h1 className="font-bold text-lg leading-tight">Pocket Doctor</h1>
                                <p className="text-xs text-slate-500 dark:text-slate-400">AI Wellness Hub</p>
                            </div>
                        </Link>
                        <nav className="flex-1 px-4 py-4 space-y-1">
                            <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-semibold" to="/">
                                <span className="material-symbols-outlined">dashboard</span>
                                <span>Dashboard</span>
                            </Link>
                            <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" to="/ai-symptom-checker-interface">
                                <span className="material-symbols-outlined">stethoscope</span>
                                <span>Consultations</span>
                            </Link>
                            <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" to="/my-health">
                                <span className="material-symbols-outlined">monitoring</span>
                                <span>My Health</span>
                            </Link>
                            <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" to="/medication-manager-calendar">
                                <span className="material-symbols-outlined">pill</span>
                                <span>Medications</span>
                            </Link>
                            <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" to="/patient-profile-records">
                                <span className="material-symbols-outlined">folder_shared</span>
                                <span>Health Records</span>
                            </Link>
                        </nav>
                        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                            <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 mb-4">
                                <p className="text-sm font-semibold mb-1">Go Premium</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Get unlimited AI scans and 24/7 doctor chat.</p>
                                <button className="w-full py-2 bg-primary text-white rounded-lg text-sm font-bold">Upgrade Now</button>
                            </div>
                            <div className="flex items-center gap-3 px-2">
                                <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700" data-alt="User profile avatar icon" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuDdROacabQcsgkHNRU9h3DjZRhBrqKeRWRfDh7W6ySZ7f1VaSESWTzydRxPYS5AKSG9lFTKidvp-_GwA5en2WRCT4ZCSajS5TI4MgzQEB2Ae4oeESmt5AknBD7hNhuyl6kn68PiaFPXYVkBw7BXcJBs4874o1zUQQ7H-j3F2VptTSS9hGTiruLTCAMrTyt2iA3hkYqihOn6QGRuAKGwBEeKpKmiXY0qL6e6bAEDZgKg4idmrbyfwl_ofr8AZqdE8oGIV03k7fq4GwM)' }}></div>
                                <Link to="/patient-profile-records" className="flex-1 min-w-0 pr-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-1 transition-colors">
                                    <p className="text-sm font-medium truncate">{profile.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{profile.role}</p>
                                </Link>
                                <div className="flex flex-col gap-2">
                                    <Link to="/patient-profile-records" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                        <span className="material-symbols-outlined text-xl">settings</span>
                                    </Link>
                                    <Link title="Logout" to="/" onClick={(e) => { e.preventDefault(); logout(); navigate('/'); }} className="text-slate-400 hover:text-red-500">
                                        <span className="material-symbols-outlined text-xl">logout</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </aside>
                    <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
                        <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
                            <div className="flex-1 max-w-xl">
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                    <input className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 focus:ring-primary focus:border-primary transition-all" placeholder="Search health records, symptoms, or doctors..." type="text" />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <HeaderActions />
                                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
                                <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative">
                                    <span className="material-symbols-outlined">notifications</span>
                                    <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-white dark:border-slate-900"></span>
                                </button>
                            </div>
                        </header>
                        <div className="p-8 max-w-7xl mx-auto space-y-8">
                            <div>
                                <h2 className="text-3xl font-extrabold tracking-tight">Good morning, {profile.name.split(' ')[0]}</h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your wellness overview.</p>
                            </div>
                            <section>
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">bolt</span>
                                    Quick Actions
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <Link to="/ai-symptom-checker-interface" className="group relative block overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all cursor-pointer">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="size-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-3xl">psychology</span>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">arrow_forward</span>
                                        </div>
                                        <h4 className="font-bold text-lg">AI Symptom Checker</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Describe how you feel for an instant preliminary analysis.</p>
                                    </Link>
                                    <Link to="/ai-x-ray-analysis-tool" className="group relative block overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all cursor-pointer">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="size-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-3xl">radiology</span>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">arrow_forward</span>
                                        </div>
                                        <h4 className="font-bold text-lg">AI X-Ray Analysis</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Upload scan reports or images for detailed insights.</p>
                                    </Link>
                                    <Link to="/first-aid-knowledge-base" className="group relative block overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all cursor-pointer">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="size-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 text-teal-600 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-3xl">chat</span>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">arrow_forward</span>
                                        </div>
                                        <h4 className="font-bold text-lg">Talk to AI Doctor</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">First aid knowledge and emergency tips anytime.</p>
                                    </Link>
                                </div>
                            </section>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <section>
                                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">analytics</span>
                                            Health Metrics
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="material-symbols-outlined text-red-500">favorite</span>
                                                    <span className="text-sm font-medium text-slate-500">Heart Rate</span>
                                                </div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-3xl font-bold">72</span>
                                                    <span className="text-slate-400 text-sm italic">bpm</span>
                                                </div>
                                                <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-red-500 rounded-full" style={{ width: '65%' }}></div>
                                                </div>
                                            </div>
                                            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="material-symbols-outlined text-blue-500">bedtime</span>
                                                    <span className="text-sm font-medium text-slate-500">Sleep</span>
                                                </div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-3xl font-bold">7.5</span>
                                                    <span className="text-slate-400 text-sm italic">hrs</span>
                                                </div>
                                                <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }}></div>
                                                </div>
                                            </div>
                                            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="material-symbols-outlined text-orange-500">steps</span>
                                                    <span className="text-sm font-medium text-slate-500">Steps</span>
                                                </div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-3xl font-bold">8,432</span>
                                                    <span className="text-slate-400 text-sm italic">steps</span>
                                                </div>
                                                <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-orange-500 rounded-full" style={{ width: '70%' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                    <section>
                                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                                <h3 className="font-bold flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-primary">timeline</span>
                                                    Activity History
                                                </h3>
                                                <select className="text-xs bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-primary">
                                                    <option>Last 7 Days</option>
                                                    <option>Last 30 Days</option>
                                                </select>
                                            </div>
                                            <div className="p-6 h-64 flex items-end justify-between gap-2">
                                                <div className="flex-1 bg-primary/20 rounded-t-lg relative group h-[40%]" title="Mon">
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">4,200 steps</div>
                                                </div>
                                                <div className="flex-1 bg-primary/20 rounded-t-lg relative group h-[60%]" title="Tue"></div>
                                                <div className="flex-1 bg-primary/20 rounded-t-lg relative group h-[85%]" title="Wed"></div>
                                                <div className="flex-1 bg-primary/20 rounded-t-lg relative group h-[45%]" title="Thu"></div>
                                                <div className="flex-1 bg-primary/20 rounded-t-lg relative group h-[70%]" title="Fri"></div>
                                                <div className="flex-1 bg-primary/40 rounded-t-lg relative group h-[95%]" title="Sat"></div>
                                                <div className="flex-1 bg-primary/20 rounded-t-lg relative group h-[30%]" title="Sun"></div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                                <div className="space-y-6">
                                    <section>
                                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                                                <h3 className="font-bold flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-primary">medication</span>
                                                    Medication Reminders
                                                </h3>
                                            </div>
                                            <div className="p-4 space-y-4">
                                                <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-primary/20 transition-all">
                                                    <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center flex-shrink-0">
                                                        <span className="material-symbols-outlined">pill</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold truncate">Lisinopril 10mg</p>
                                                        <p className="text-xs text-slate-500">1 tablet, Daily</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full">08:00 AM</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-primary/20 transition-all">
                                                    <div className="size-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                                        <span className="material-symbols-outlined">vaccines</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold truncate">Omega-3 Fish Oil</p>
                                                        <p className="text-xs text-slate-500">2 softgels, Morning</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">Taken</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-primary/20 transition-all">
                                                    <div className="size-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center flex-shrink-0">
                                                        <span className="material-symbols-outlined">pill</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold truncate">Vitamin D3</p>
                                                        <p className="text-xs text-slate-500">1 tablet, Evening</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-bold text-slate-500 uppercase bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">09:00 PM</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
                                                <button className="w-full text-center text-sm font-semibold text-primary hover:underline flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">add_circle</span>
                                                    Add New Reminder
                                                </button>
                                            </div>
                                        </div>
                                    </section>
                                    <section>
                                        <div className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-6 text-white relative overflow-hidden">
                                            <div className="relative z-10">
                                                <h4 className="font-bold text-lg mb-2">Upcoming Appointment</h4>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="size-10 rounded-full border-2 border-white/30 overflow-hidden">
                                                        <img className="w-full h-full object-cover" data-alt="Doctor portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2LTfL8vmnxFUqEHMPndVYKPcjEunq9AZV8yexl57tmHbFl-Ey8I7dA4rMvTOiNgn1-5-drx_r21deFRRSZhiegA6ubVf_XAykAQ3jgxLlNCamGFlhXJqvhGCBfti-aae-qQtjq8PMDaR2chCrYkbjdbm0QZKsCSse4-sYQiliBS8VahTvF-nEkMq_3Em4Qb-MOwf5aarHg6xCoY6aWI6piZB3Y2mJYtvP_-gc5hb0YCL1dS3d8BMRBeT2_AjvYjZV9iDcSjPTr-k" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Dr. Sarah Miller</p>
                                                        <p className="text-xs text-white/70">Cardiologist</p>
                                                    </div>
                                                </div>
                                                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex justify-between items-center mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                        <span className="text-xs font-medium">Oct 26, 2024</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-sm">schedule</span>
                                                        <span className="text-xs font-medium">10:30 AM</span>
                                                    </div>
                                                </div>
                                                <button className="w-full py-2 bg-white text-primary rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">Join Video Call</button>
                                            </div>
                                            <span className="material-symbols-outlined absolute -bottom-6 -right-6 text-[120px] text-white/5 rotate-12">video_call</span>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>

            </div>
        </>
    );
};

export default MainWellnessDashboard;
