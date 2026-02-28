import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderActions from '../components/HeaderActions';

const MedicationManagerCalendar = () => {
    const [activeTab, setActiveTab] = useState('Month');
    const [monthOffset, setMonthOffset] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMed, setNewMed] = useState({ name: '', dosage: '', indication: '', schedule: '' });

    const [prescriptions, setPrescriptions] = useState([
        { id: 1, name: 'Lisinopril', dosage: '10mg', indication: 'Hypertension Management', schedule: '8:00 AM Daily', remaining: '12 / 30 pills', status: 'Refill Now', icon: 'pill' },
        { id: 2, name: 'Metformin', dosage: '500mg', indication: 'Type 2 Diabetes Control', schedule: 'With Breakfast', remaining: '5 / 60 pills', status: 'Refill Urgent', icon: 'pill' },
        { id: 3, name: 'Vitamin D3', dosage: '2000IU', indication: 'Immune Support', schedule: '1x Weekly (Sun)', remaining: '24 / 24 caps', status: 'Refill Not Ready', icon: 'medication_liquid' }
    ]);

    const months = ['August 2023', 'September 2023', 'October 2023', 'November 2023', 'December 2023'];
    // Handle wrapping around the array safely
    const currentMonthIndex = ((2 + monthOffset) % months.length + months.length) % months.length;
    const currentMonth = months[currentMonthIndex];

    const handleAddMedication = (e) => {
        e.preventDefault();
        if (!newMed.name) return;
        const med = {
            id: Date.now(),
            name: newMed.name,
            dosage: newMed.dosage || 'N/A',
            indication: newMed.indication || 'General',
            schedule: newMed.schedule || 'Daily',
            remaining: '30 / 30 pills',
            status: 'Refill Not Ready',
            icon: 'pill'
        };
        setPrescriptions([med, ...prescriptions]);
        setIsModalOpen(false);
        setNewMed({ name: '', dosage: '', indication: '', schedule: '' });
    };

    const handleRefill = (id) => {
        setPrescriptions(prescriptions.map(p => {
            if (p.id === id && p.status !== 'Refill Not Ready') {
                return { ...p, remaining: '30 / 30 pills', status: 'Refill Not Ready' };
            }
            return p;
        }));
    };
    return (
        <>
            <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
                <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden">
                    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-10 py-3 bg-white dark:bg-background-dark sticky top-0 z-50">
                        <div className="flex items-center gap-8">
                            <Link to="/dashboard" className="flex items-center gap-4 text-primary hover:opacity-80 transition-opacity">
                                <div className="size-6 bg-primary rounded-lg flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined text-sm">medical_services</span>
                                </div>
                                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Pocket Doctor</h2>
                            </Link>
                            <label className="flex flex-col min-w-40 !h-10 max-w-64">
                                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                                    <div className="text-slate-400 dark:text-slate-500 flex border-none bg-slate-100 dark:bg-slate-800 items-center justify-center pl-4 rounded-l-lg border-r-0">
                                        <span className="material-symbols-outlined">search</span>
                                    </div>
                                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-slate-100 dark:bg-slate-800 focus:border-none h-full placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal" placeholder="Search medications..." value="" />
                                </div>
                            </label>
                        </div>
                        <div className="flex flex-1 justify-end gap-8">
                            <div className="flex items-center gap-9">
                                <Link className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" to="/dashboard">Dashboard</Link>
                                <Link className="text-primary text-sm font-bold border-b-2 border-primary py-1" to="/medication-manager-calendar">Medications</Link>
                                <Link className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" to="/ai-symptom-checker-interface">Symptoms</Link>
                                <Link className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" to="/patient-profile-records">Health Records</Link>
                            </div>
                            <div className="flex gap-2">
                                <HeaderActions />
                            </div>
                        </div>
                    </header>
                    <main className="flex flex-1 p-6 lg:p-10 gap-8">
                        <div className="flex-1 flex flex-col gap-8">
                            <div className="flex items-end justify-between">
                                <div>
                                    <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">Medication Manager</h1>
                                    <p className="text-slate-500 dark:text-slate-400 text-lg">Adherence score: <span className="text-emerald-500 font-bold">95%</span> this month</p>
                                </div>
                                <button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20">
                                    <span className="material-symbols-outlined">add</span>
                                    Add New Medication
                                </button>
                            </div>
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-xl font-bold dark:text-white">{currentMonth}</h2>
                                        <div className="flex gap-1">
                                            <button onClick={() => setMonthOffset(p => p - 1)} className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                                <span className="material-symbols-outlined">chevron_left</span>
                                            </button>
                                            <button onClick={() => setMonthOffset(p => p + 1)} className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                                <span className="material-symbols-outlined">chevron_right</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                                        {['Month', 'Week', 'Day'].map(tab => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`px-4 py-1.5 rounded-lg shadow-sm font-medium text-sm transition-colors ${activeTab === tab ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 text-center font-bold text-xs uppercase tracking-wider text-slate-500">Sun</div>
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 text-center font-bold text-xs uppercase tracking-wider text-slate-500">Mon</div>
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 text-center font-bold text-xs uppercase tracking-wider text-slate-500">Tue</div>
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 text-center font-bold text-xs uppercase tracking-wider text-slate-500">Wed</div>
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 text-center font-bold text-xs uppercase tracking-wider text-slate-500">Thu</div>
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 text-center font-bold text-xs uppercase tracking-wider text-slate-500">Fri</div>
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 text-center font-bold text-xs uppercase tracking-wider text-slate-500">Sat</div>
                                    <div className="bg-white dark:bg-slate-900 min-h-[120px] p-2 opacity-30">24</div>
                                    <div className="bg-white dark:bg-slate-900 min-h-[120px] p-2 opacity-30">25</div>
                                    <div className="bg-white dark:bg-slate-900 min-h-[120px] p-2 opacity-30">26</div>
                                    <div className="bg-white dark:bg-slate-900 min-h-[120px] p-2 opacity-30">27</div>
                                    <div className="bg-white dark:bg-slate-900 min-h-[120px] p-2 opacity-30">28</div>
                                    <div className="bg-white dark:bg-slate-900 min-h-[120px] p-2 opacity-30">29</div>
                                    <div className="bg-white dark:bg-slate-900 min-h-[120px] p-2 opacity-30">30</div>
                                    <div className="bg-white dark:bg-slate-900 min-h-[120px] p-2">
                                        <span className="text-sm font-semibold">1</span>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 min-h-[120px] p-2">
                                        <span className="text-sm font-semibold">2</span>
                                        <div className="mt-2 flex flex-col gap-1">
                                            <div className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] px-2 py-1 rounded border border-emerald-200 dark:border-emerald-500/30 truncate">Morning Meds (3)</div>
                                            <div className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] px-2 py-1 rounded border border-amber-200 dark:border-amber-500/30 truncate">Evening Meds (1)</div>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 min-h-[120px] p-2 ring-2 ring-primary ring-inset">
                                        <span className="text-sm font-bold text-primary">3 Today</span>
                                        <div className="mt-2 flex flex-col gap-1">
                                            <div className="bg-emerald-500 text-white text-[10px] px-2 py-1 rounded font-bold flex items-center justify-between">
                                                <span>Morning Meds</span>
                                                <span className="material-symbols-outlined text-[12px]">check_circle</span>
                                            </div>
                                            <div className="bg-primary/10 text-primary text-[10px] px-2 py-1 rounded border border-primary/20 flex items-center justify-between">
                                                <span>Noon Dose</span>
                                                <span className="material-symbols-outlined text-[12px]">schedule</span>
                                            </div>
                                            <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] px-2 py-1 rounded border border-slate-200 dark:border-slate-700">Evening Meds</div>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 min-h-[120px] p-2"><span className="text-sm font-semibold">4</span></div>
                                    <div className="bg-white dark:bg-slate-900 min-h-[120px] p-2"><span className="text-sm font-semibold">5</span></div>
                                    <div className="bg-white dark:bg-slate-900 min-h-[120px] p-2"><span className="text-sm font-semibold">6</span></div>
                                    <div className="bg-white dark:bg-slate-900 min-h-[120px] p-2"><span className="text-sm font-semibold">7</span></div>
                                    <div className="bg-white dark:bg-slate-900 min-h-[120px] p-2"><span className="text-sm font-semibold">8</span></div>
                                    <div className="bg-white dark:bg-slate-900 min-h-[120px] p-2"><span className="text-sm font-semibold">9</span></div>
                                    <div className="bg-white dark:bg-slate-900 min-h-[120px] p-2"><span className="text-sm font-semibold">10</span></div>
                                    <div className="bg-white dark:bg-slate-900 min-h-[120px] p-2"><span className="text-sm font-semibold">11</span></div>
                                    <div className="bg-white dark:bg-slate-900 min-h-[120px] p-2"><span className="text-sm font-semibold">12</span></div>
                                    <div className="bg-white dark:bg-slate-900 min-h-[120px] p-2"><span className="text-sm font-semibold">13</span></div>
                                    <div className="bg-white dark:bg-slate-900 min-h-[120px] p-2"><span className="text-sm font-semibold">14</span></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="material-symbols-outlined text-amber-500">warning</span>
                                        <h3 className="text-lg font-bold">Drug Interaction AI Checker</h3>
                                    </div>
                                    <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-amber-500 text-white p-2 rounded-lg">
                                                <span className="material-symbols-outlined">shield</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-amber-800 dark:text-amber-400">Potential Moderate Interaction</p>
                                                <p className="text-sm text-amber-700 dark:text-amber-300/80 mt-1">Lisinopril + Potassium Supplements can increase potassium levels in your blood. Our AI recommends consulting your GP before the next dose.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="material-symbols-outlined text-primary">analytics</span>
                                        <h3 className="text-lg font-bold">Health Insights</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Systolic Pressure Avg</span>
                                            <span className="font-bold text-emerald-500">122 mmHg (Normal)</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full">
                                            <div className="bg-emerald-500 h-2 rounded-full w-3/4"></div>
                                        </div>
                                        <p className="text-xs text-slate-400">Based on your regular Lisinopril adherence, your pressure is stabilizing.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <aside className="w-[400px] hidden xl:flex flex-col gap-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold">Current Prescriptions</h3>
                                    <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold">{prescriptions.length} Active</span>
                                </div>
                                <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                                    {prescriptions.map((med) => (
                                        <div key={med.id} className="group bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary transition-all">
                                            <div className="flex gap-4">
                                                <div className="size-16 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center p-2 border border-slate-100 dark:border-slate-600 overflow-hidden">
                                                    <div className="w-full h-full bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-slate-400">{med.icon}</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-bold text-slate-900 dark:text-white">{med.name}</h4>
                                                        <span className="text-primary font-bold text-sm">{med.dosage}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{med.indication}</p>
                                                    <div className="mt-3 flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-xs text-slate-400">schedule</span>
                                                        <span className="text-xs font-medium">{med.schedule}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Remaining</span>
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{med.remaining}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleRefill(med.id)}
                                                    disabled={med.status === 'Refill Not Ready'}
                                                    className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm ${med.status === 'Refill Urgent'
                                                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                                                            : med.status === 'Refill Now'
                                                                ? 'bg-primary/10 hover:bg-primary/20 text-primary'
                                                                : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                                                        }`}
                                                >
                                                    {med.status}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/20">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary text-white p-2 rounded-lg">
                                            <span className="material-symbols-outlined">psychiatry</span>
                                        </div>
                                        <p className="text-sm font-medium">Pocket Doctor AI is monitoring your symptom logs for any drug side effects.</p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </main>
                </div>
            </div>

            {/* Add Medication Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 animate-fade-in-up transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold dark:text-white">Add Medication</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors flex items-center justify-center">
                                <span className="material-symbols-outlined text-[20px] dark:text-white">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleAddMedication} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Medication Name</label>
                                <input autoFocus required value={newMed.name} onChange={e => setNewMed({ ...newMed, name: e.target.value })} type="text" className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Amoxicillin" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Dosage</label>
                                <input value={newMed.dosage} onChange={e => setNewMed({ ...newMed, dosage: e.target.value })} type="text" className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. 250mg" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Schedule</label>
                                <input value={newMed.schedule} onChange={e => setNewMed({ ...newMed, schedule: e.target.value })} type="text" className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Twice Daily" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Indication (Optional)</label>
                                <input value={newMed.indication} onChange={e => setNewMed({ ...newMed, indication: e.target.value })} type="text" className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Infection" />
                            </div>
                            <button type="submit" className="mt-4 w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-primary/20">
                                Save Medication
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default MedicationManagerCalendar;
