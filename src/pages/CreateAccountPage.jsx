import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreateAccountPage = () => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    // Step 2 – Health Info
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [bloodType, setBloodType] = useState('');
    const [allergies, setAllergies] = useState('');
    const [conditions, setConditions] = useState('');

    // Step 3 – Security
    const [twoFactor, setTwoFactor] = useState(false);
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');

    const { signup } = useAuth();
    const navigate = useNavigate();

    const stepLabels = ['Account Details', 'Health Info', 'Security'];

    const nextStep = () => {
        setError('');
        setStep(s => Math.min(s + 1, 3));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const prevStep = () => {
        setError('');
        setStep(s => Math.max(s - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFinalSubmit = (e) => {
        e.preventDefault();
        setError('');
        const result = signup({ name, email, phone, dob, gender, height, weight, bloodType, allergies, conditions });
        if (result.success) {
            navigate('/main-wellness-dashboard');
        } else {
            setError(result.error);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white font-display text-slate-900 border-t-8 border-blue-600">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-blue-600">
                    <span className="material-symbols-outlined text-2xl">health_and_safety</span>
                    <span className="text-xl font-bold tracking-tight text-slate-900">ArogyaSetu</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
                    <a href="#" className="hover:text-slate-900 transition-colors">How it Works</a>
                    <a href="#" className="hover:text-slate-900 transition-colors">Security</a>
                    <a href="#" className="hover:text-slate-900 transition-colors">Support</a>
                    <Link to="/login" className="px-5 py-2 text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded-lg transition-colors">
                        Log In
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12">

                    {/* Header Details */}
                    <div className="flex justify-between items-end mb-8 border-b border-slate-100 pb-6">
                        <div>
                            <h1 className="text-3xl font-extrabold mb-1">Create your account</h1>
                            <p className="text-sm font-bold text-slate-500">Step {step} of 3: {stepLabels[step - 1]}</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-1 text-[10px] font-black tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded uppercase">
                            <span className="material-symbols-outlined text-sm">verified_user</span>
                            HIPAA Compliant
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="grid grid-cols-3 gap-0 mb-10 text-xs font-bold">
                        <div className={`pb-2 flex items-center justify-center gap-1 border-b-2 ${step >= 1 ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-slate-100'}`}>
                            <span className="material-symbols-outlined text-sm">account_circle</span>
                            <span className="hidden sm:inline">Account Details</span>
                            <span className="sm:hidden">Account</span>
                        </div>
                        <div className={`pb-2 flex items-center justify-center gap-1 border-b-2 ${step >= 2 ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-slate-100'}`}>
                            <span className="material-symbols-outlined text-sm">favorite</span>
                            <span>Health Info</span>
                        </div>
                        <div className={`pb-2 flex items-center justify-center gap-1 border-b-2 ${step >= 3 ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-slate-100'}`}>
                            <span className="material-symbols-outlined text-sm">shield</span>
                            <span>Security</span>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-medium flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">error</span>
                            {error}
                        </div>
                    )}

                    {/* ── Step 1: Account Details ── */}
                    {step === 1 && (
                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold mb-2 text-slate-700">Full Name</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm">person</span>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-primary focus:border-primary transition-colors focus:bg-white"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-2 text-slate-700">Phone Number</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm">call</span>
                                        <input
                                            type="tel"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-primary focus:border-primary transition-colors focus:bg-white"
                                            placeholder="+1 (555) 000-0000"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold mb-2 text-slate-700">Email Address</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm">mail</span>
                                    <input
                                        type="email"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-primary focus:border-primary transition-colors focus:bg-white"
                                        placeholder="john@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold mb-2 text-slate-700">Create Password</label>
                                <div className="relative mb-2">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm">lock</span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-10 py-3 text-sm focus:ring-primary focus:border-primary transition-colors focus:bg-white tracking-widest"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        <span className="material-symbols-outlined text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Must be at least 8 characters long with a symbol.</p>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 mt-4"
                            >
                                Continue to Health Info
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </form>
                    )}

                    {/* ── Step 2: Health Info ── */}
                    {step === 2 && (
                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold mb-2 text-slate-700">Date of Birth</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm">calendar_today</span>
                                        <input
                                            type="date"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-primary focus:border-primary transition-colors focus:bg-white"
                                            value={dob}
                                            onChange={(e) => setDob(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-2 text-slate-700">Gender</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm">wc</span>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-primary focus:border-primary transition-colors focus:bg-white appearance-none"
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="non-binary">Non-binary</option>
                                            <option value="prefer-not">Prefer not to say</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold mb-2 text-slate-700">Height (cm)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm">height</span>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-primary focus:border-primary transition-colors focus:bg-white"
                                            placeholder="e.g. 170"
                                            value={height}
                                            onChange={(e) => setHeight(e.target.value)}
                                            min="50"
                                            max="300"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-2 text-slate-700">Weight (kg)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm">monitor_weight</span>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-primary focus:border-primary transition-colors focus:bg-white"
                                            placeholder="e.g. 70"
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                            min="10"
                                            max="500"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold mb-2 text-slate-700">Blood Type</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm">bloodtype</span>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-primary focus:border-primary transition-colors focus:bg-white appearance-none"
                                        value={bloodType}
                                        onChange={(e) => setBloodType(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Select blood type</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold mb-2 text-slate-700">Known Allergies <span className="text-slate-400 font-medium">(optional)</span></label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 material-symbols-outlined text-slate-400 text-sm">warning</span>
                                    <textarea
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-primary focus:border-primary transition-colors focus:bg-white"
                                        placeholder="e.g. Penicillin, Peanuts (leave empty if none)"
                                        rows={2}
                                        value={allergies}
                                        onChange={(e) => setAllergies(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold mb-2 text-slate-700">Existing Medical Conditions <span className="text-slate-400 font-medium">(optional)</span></label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 material-symbols-outlined text-slate-400 text-sm">medical_information</span>
                                    <textarea
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-primary focus:border-primary transition-colors focus:bg-white"
                                        placeholder="e.g. Asthma, Diabetes (leave empty if none)"
                                        rows={2}
                                        value={conditions}
                                        onChange={(e) => setConditions(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] py-3.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                                >
                                    Continue to Security
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            </div>
                        </form>
                    )}

                    {/* ── Step 3: Security ── */}
                    {step === 3 && (
                        <form className="space-y-6" onSubmit={handleFinalSubmit}>
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3 mb-2">
                                <span className="material-symbols-outlined text-blue-600 mt-0.5">shield</span>
                                <div>
                                    <p className="text-sm font-bold text-blue-800">Secure your account</p>
                                    <p className="text-xs text-blue-600 mt-0.5">Set up additional security to protect your health data.</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold mb-2 text-slate-700">Security Question</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm">help</span>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-primary focus:border-primary transition-colors focus:bg-white appearance-none"
                                        value={securityQuestion}
                                        onChange={(e) => setSecurityQuestion(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Choose a security question</option>
                                        <option value="pet">What was the name of your first pet?</option>
                                        <option value="city">In what city were you born?</option>
                                        <option value="school">What was the name of your first school?</option>
                                        <option value="mother">What is your mother's maiden name?</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold mb-2 text-slate-700">Security Answer</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm">key</span>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-primary focus:border-primary transition-colors focus:bg-white"
                                        placeholder="Your answer"
                                        value={securityAnswer}
                                        onChange={(e) => setSecurityAnswer(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="twoFactor"
                                    className="rounded border-slate-300 text-primary focus:ring-primary size-4"
                                    checked={twoFactor}
                                    onChange={(e) => setTwoFactor(e.target.checked)}
                                />
                                <label htmlFor="twoFactor" className="text-sm font-medium text-slate-700 cursor-pointer">
                                    Enable two-factor authentication <span className="text-xs text-slate-400">(recommended)</span>
                                </label>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] py-3.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                    Create Account
                                </button>
                            </div>
                        </form>
                    )}

                    <p className="text-xs text-center font-medium text-slate-400 mt-6">
                        By clicking continue, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                    </p>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-6 sm:gap-12 mt-12 text-slate-500">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-blue-500 border border-slate-200 shadow-sm"><span className="material-symbols-outlined text-lg">enhanced_encryption</span></div>
                        <div className="flex flex-col"><span className="text-xs font-black uppercase tracking-wider text-slate-700">256-Bit AES</span><span className="text-[10px] font-medium uppercase">Encryption App</span></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-blue-500 border border-slate-200 shadow-sm"><span className="material-symbols-outlined text-lg">admin_panel_settings</span></div>
                        <div className="flex flex-col"><span className="text-xs font-black uppercase tracking-wider text-slate-700">GDPR Ready</span><span className="text-[10px] font-medium uppercase">Privacy Compliant</span></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-blue-500 border border-slate-200 shadow-sm"><span className="material-symbols-outlined text-lg">biotech</span></div>
                        <div className="flex flex-col"><span className="text-xs font-black uppercase tracking-wider text-slate-700">Medical Grade</span><span className="text-[10px] font-medium uppercase">AI Analysis</span></div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center py-6 text-[10px] md:text-xs font-medium text-slate-400">
                © {new Date().getFullYear()} ArogyaSetu AI. All your medical data is stored securely and never shared with third parties without your explicit consent.
            </footer>
        </div>
    );
};

export default CreateAccountPage;
