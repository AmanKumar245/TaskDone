import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        zipCode: '',
        goal: '', // 'get_things_done' or 'earn_money'
        marketingConsent: false,
        termsAccepted: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleContinueToStep2 = () => {
        if (formData.email) setStep(2);
    };

    const handleContinueToStep3 = () => {
        if (formData.password.length >= 8) setStep(3);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Save token to localStorage
                localStorage.setItem('token', data.token);
                // Save user info
                localStorage.setItem('userInfo', JSON.stringify({
                    _id: data._id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    role: data.role
                }));
                
                // Redirect to homepage or dashboard
                navigate('/');
            } else {
                setError(data.message || 'Signup failed. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    // Icons inline SVG
    const EyeIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
    );

    const EyeOffIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
    );

    const CheckIcon = ({ color }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    );

    const renderStep1 = () => (
        <div className="w-full max-w-[400px]">
            <h1 className="text-[32px] font-black text-[#071343] tracking-tighter mb-8 text-center leading-tight">
                Sign up to Airtasker
            </h1>
            <div className="flex flex-col gap-5">
                <div className="relative">
                    <input
                        type="email"
                        name="email"
                        id="signup-email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white border-2 border-[#071343] rounded-lg px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#071343] peer pt-5 pb-2 font-medium"
                        placeholder=" "
                    />
                    <label
                        htmlFor="signup-email"
                        className="absolute left-3 top-0 transform -translate-y-1/2 bg-white px-1 text-xs font-bold text-[#071343] pointer-events-none"
                    >
                        Email Address*
                    </label>
                </div>

                {/* Captcha Mock */}
                <div className="bg-[#2d2d2d] rounded-sm p-4 flex items-center gap-4 text-white shadow-sm border border-gray-600">
                    <div className="w-6 h-6 border-2 border-gray-400 rounded-sm bg-transparent cursor-pointer hover:border-white transition flex-shrink-0"></div>
                    <span className="text-sm">Verify you are human</span>
                </div>

                <button 
                    type="button"
                    onClick={handleContinueToStep2}
                    disabled={!formData.email}
                    className="w-full bg-[#0047fb] text-white py-3.5 rounded-full font-bold text-lg hover:bg-blue-700 transition mt-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    Continue
                </button>
            </div>

            <div className="text-center mt-6 text-sm text-[#071343] font-medium">
                Already have an account? <Link to="/login" className="text-[#0047fb] font-bold hover:underline">Log in</Link>
            </div>

            <div className="flex items-center justify-center my-6 gap-3">
                <span className="text-[10px] font-bold text-[#071343] uppercase tracking-wider">OR</span>
            </div>

            <div className="space-y-3 relative z-10 bg-white">
                <button className="w-full border border-gray-300 text-[#071343] bg-white py-3 rounded-full font-bold hover:bg-gray-50 transition flex items-center justify-center gap-3 relative z-10">
                    <span className="text-lg">G</span> Continue with Google
                </button>
                <button className="w-full border border-gray-300 text-[#071343] bg-white py-3 rounded-full font-bold hover:bg-gray-50 transition flex items-center justify-center gap-3 relative z-10">
                    <span className="text-lg text-blue-600">f</span> Continue with Facebook
                </button>
                <button className="w-full border border-gray-300 text-[#071343] bg-white py-3 rounded-full font-bold hover:bg-gray-50 transition flex items-center justify-center gap-3 relative z-10">
                    <span className="text-lg"></span> Continue with Apple
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => {
        const isPasswordValid = formData.password.length >= 8;
        return (
            <div className="w-full max-w-[400px]">
                <h1 className="text-[32px] font-black text-[#071343] tracking-tighter mb-8 text-center leading-tight">
                    Set up your password
                </h1>
                
                {/* Connected Inputs Container */}
                <div className="rounded-lg overflow-hidden border-2 border-transparent focus-within:border-[#071343] transition-colors mb-6 shadow-sm">
                    {/* Top part: Email (readonly) */}
                    <div className="bg-[#e4e5eb] px-4 py-4 text-[#071343] font-medium">
                        {formData.email}
                    </div>
                    
                    {/* Bottom part: Password */}
                    <div className="bg-[#f5f6fa] relative">
                        <label className="absolute left-4 top-2 text-xs font-bold text-[#071343]">
                            Password*
                        </label>
                        <div className="flex items-center">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-transparent px-4 pt-7 pb-3 text-[#071343] focus:outline-none text-lg"
                                placeholder=""
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="pr-4 text-[#071343] hover:text-[#0047fb] transition-colors relative group"
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs font-bold py-1 px-2 rounded hidden group-hover:block whitespace-pre text-center z-10 before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-[5px] before:border-transparent before:border-t-black">
                                    {showPassword ? 'Hide\npassword' : 'Show\npassword'}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <p className="text-[#071343] text-[15px] font-medium mb-3">Your password must contain:</p>
                    <div className="flex items-center gap-2">
                        <CheckIcon color={isPasswordValid ? "#00c464" : "#cbd5e1"} />
                        <span className={`text-[15px] ${isPasswordValid ? "text-[#00c464]" : "text-gray-500"}`}>
                            At least 8 characters
                        </span>
                    </div>
                </div>

                <button 
                    type="button"
                    onClick={handleContinueToStep3}
                    disabled={!isPasswordValid}
                    className="w-full bg-[#0047fb] text-white py-3.5 rounded-full font-bold text-lg hover:bg-blue-700 transition mb-4 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    Continue
                </button>
                
                <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full bg-transparent text-[#0047fb] py-3.5 rounded-full font-bold text-lg hover:bg-blue-50 transition"
                >
                    Go back
                </button>
            </div>
        );
    };

    const renderStep3 = () => (
        <div className="w-full max-w-[400px]">
            <div className="flex flex-col gap-6">
                
                {/* Name Row */}
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full bg-white border-2 border-[#e2e4ed] rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-[#071343] peer pt-6 pb-2 font-medium"
                            placeholder=" "
                        />
                        <label
                            htmlFor="firstName"
                            className="absolute left-4 top-2 text-xs font-bold text-[#071343] transition-all"
                        >
                            First name
                        </label>
                    </div>
                    <div className="relative flex-1">
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full bg-white border-2 border-[#e2e4ed] rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-[#071343] peer pt-6 pb-2 font-medium"
                            placeholder=" "
                        />
                        <label
                            htmlFor="lastName"
                            className="absolute left-4 top-2 text-xs font-bold text-[#071343] transition-all"
                        >
                            Last name
                        </label>
                    </div>
                </div>

                {/* Phone */}
                <div className="relative">
                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-white border-2 border-[#e2e4ed] rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-[#071343] peer pt-6 pb-2 font-medium"
                        placeholder=" "
                    />
                    <label
                        htmlFor="phone"
                        className="absolute left-4 top-2 text-xs font-bold text-[#071343]"
                    >
                        Phone number
                    </label>
                </div>

                {/* ZIP Code */}
                <div>
                    <h3 className="text-[#071343] font-bold text-lg mb-3">Enter your home ZIP code</h3>
                    <div className="relative">
                        <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            className="w-full bg-[#f4f5f8] border-2 border-transparent rounded-lg px-4 py-3.5 text-gray-900 focus:outline-none focus:border-[#071343] font-medium"
                            placeholder="e.g. 90001"
                        />
                    </div>
                </div>

                {/* Goal Selection */}
                <div>
                    <h3 className="text-[#071343] font-bold text-lg mb-3">What is your main goal on Airtasker?</h3>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData({...formData, goal: 'get_things_done'})}
                            className={`flex-1 flex flex-col items-center justify-center py-6 rounded-lg border-2 transition-all ${formData.goal === 'get_things_done' ? 'bg-[#071343] border-[#071343] text-white' : 'bg-[#f4f5f8] border-transparent text-[#071343] hover:border-[#071343]'}`}
                        >
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-3 ${formData.goal === 'get_things_done' ? 'border-white' : 'border-[#071343]'}`}>
                                {formData.goal === 'get_things_done' && <CheckIcon color="white" />}
                            </div>
                            <span className="font-bold">Get things done</span>
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => setFormData({...formData, goal: 'earn_money'})}
                            className={`flex-1 flex flex-col items-center justify-center py-6 rounded-lg border-2 transition-all ${formData.goal === 'earn_money' ? 'bg-[#071343] border-[#071343] text-white' : 'bg-[#f4f5f8] border-transparent text-[#071343] hover:border-[#071343]'}`}
                        >
                            <div className="text-2xl mb-2 font-medium">$</div>
                            <span className="font-bold">Earn money</span>
                        </button>
                    </div>
                </div>

                {/* Checkboxes */}
                <div className="flex flex-col gap-4 mt-2">
                    <label className="flex items-start gap-4 cursor-pointer">
                        <input
                            type="checkbox"
                            name="marketingConsent"
                            checked={formData.marketingConsent}
                            onChange={handleChange}
                            className="mt-1 w-5 h-5 rounded border-2 border-[#e2e4ed] text-[#0047fb] focus:ring-[#0047fb] accent-[#0047fb] cursor-pointer"
                        />
                        <span className="text-[14px] text-[#071343] font-medium leading-snug">
                            I agree to receive product updates, marketing materials and special offers via email, SMS, and push notifications
                        </span>
                    </label>
                    <label className="flex items-start gap-4 cursor-pointer">
                        <input
                            type="checkbox"
                            name="termsAccepted"
                            checked={formData.termsAccepted}
                            onChange={handleChange}
                            className="mt-1 w-5 h-5 rounded border-2 border-[#e2e4ed] text-[#0047fb] focus:ring-[#0047fb] accent-[#0047fb] cursor-pointer"
                        />
                        <span className="text-[14px] text-[#071343] font-medium leading-snug">
                            I agree to the Airtasker <a href="#" className="text-[#0047fb] hover:underline">Terms & Conditions</a>, <a href="#" className="text-[#0047fb] hover:underline">Community Guidelines</a> and <a href="#" className="text-[#0047fb] hover:underline">Privacy Policy</a>
                        </span>
                    </label>
                </div>

                {/* Submit Buttons */}
                <div className="mt-2">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 font-medium">
                            {error}
                        </div>
                    )}
                    <button 
                        type="button"
                        onClick={handleSubmit}
                        disabled={!formData.firstName || !formData.lastName || !formData.zipCode || !formData.goal || !formData.termsAccepted || isLoading}
                        className="w-full bg-[#0047fb] text-white py-3.5 rounded-full font-bold text-lg hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Creating account...
                            </>
                        ) : 'Complete my account'}
                    </button>
                    
                    <button 
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-full mt-2 bg-transparent text-[#0047fb] py-3.5 rounded-full font-bold text-lg hover:bg-blue-50 transition"
                    >
                        Go back
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans relative">
            <div className="flex-grow flex flex-col overflow-y-auto overflow-x-hidden">

                {/* Minimal Header */}
                <header className="p-6">
                    <Link to="/" className="text-[#0047fb] font-black text-3xl tracking-tighter inline-block">
                        TaskDone
                    </Link>
                </header>

                {/* Form Container */}
                <main className="flex-grow flex flex-col items-center justify-center -mt-16 px-4 py-12 relative z-10 w-full">
                    <form className="w-full flex justify-center" onSubmit={(e) => e.preventDefault()}>
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}
                    </form>
                </main>

            </div>

            {/* Footer sticky to bottom layout (only shown on step 1 normally, but we can keep it everywhere if we want, but step 3 has its own terms checkbox) */}
            {step === 1 && (
                <footer className="w-full py-4 text-center bg-white border-t border-transparent z-10 mt-auto shrink-0 relative">
                    <p className="text-[#848fa5] text-[11px] md:text-xs">
                        By proceeding, I agree to Airtasker's <a href="#" className="text-[#0047fb] hover:underline">Terms & Conditions</a>, <a href="#" className="text-[#0047fb] hover:underline">Community Guidelines</a>, & <a href="#" className="text-[#0047fb] hover:underline">Privacy Policy</a>
                    </p>
                </footer>
            )}
        </div>
    );
};

export default Signup;
