import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axiosInstance from '../api/axios';
import { setCredentials } from '../store/authSlice';

const Login = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleContinueToStep2 = () => {
        if (email) {
            setStep(2);
            setError(null);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { data } = await axiosInstance.post('/users/login', { email, password });

            dispatch(setCredentials({
                userInfo: {
                    _id: data._id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    role: data.role,
                    avatar: data.avatar,
                },
                token: data.token,
            }));

            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Network error. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    // Icons inline SVG
    const EyeIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
    );

    const EyeOffIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
    );

    const renderStep1 = () => (
        <div className="w-full max-w-[400px]">
            <h1 className="text-[32px] font-black text-[#071343] tracking-tighter mb-8 text-center leading-tight">
                Login to your account
            </h1>
            <div className="flex flex-col gap-5">
                <div className="relative">
                    <input
                        type="email"
                        id="login-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border-2 border-[#071343] rounded-lg px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#071343] peer pt-5 pb-2 font-medium"
                        placeholder=" "
                        onKeyDown={(e) => e.key === 'Enter' && handleContinueToStep2()}
                    />
                    <label
                        htmlFor="login-email"
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
                    disabled={!email}
                    className="w-full bg-[#0047fb] text-white py-3.5 rounded-full font-bold text-lg hover:bg-blue-700 transition mt-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    Continue
                </button>
            </div>

            <div className="text-center mt-6 text-[15px] text-[#071343] font-medium">
                Don't have an account? <Link to="/signup" className="text-[#0047fb] font-bold hover:underline">Sign up</Link>
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

    const renderStep2 = () => (
        <div className="w-full max-w-[400px]">
            <h1 className="text-[32px] font-black text-[#071343] tracking-tighter mb-8 text-center leading-tight">
                Login to your account
            </h1>

            <div className="flex flex-col gap-6">
                {/* Email Display with Edit Button */}
                <div className="flex justify-between items-center px-1">
                    <span className="text-[#071343] font-medium text-[16px]">{email}</span>
                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-[#0047fb] font-bold text-[15px] hover:underline"
                    >
                        Edit
                    </button>
                </div>

                {/* Password Input */}
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="login-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#f4f5f8] border-2 border-[#071343] rounded-lg px-4 py-3.5 text-[#071343] focus:outline-none focus:ring-1 focus:ring-[#071343] peer pt-5 pb-2 font-medium text-lg pr-12"
                        placeholder=" "
                        onKeyDown={(e) => e.key === 'Enter' && password && handleLogin(e)}
                    />
                    <label
                        htmlFor="login-password"
                        className="absolute left-3 top-0 transform -translate-y-1/2 bg-white px-1 text-xs font-bold text-[#071343] pointer-events-none"
                    >
                        Password*
                    </label>
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#071343] transition-colors"
                    >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                </div>

                {/* Reset Password Link */}
                <div className="-mt-3 px-1">
                    <a href="#" className="text-[#0047fb] font-bold text-[15px] hover:underline">
                        Reset password
                    </a>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="button"
                    onClick={handleLogin}
                    disabled={!password || isLoading}
                    className="w-full bg-[#0047fb] text-white py-3.5 rounded-full font-bold text-lg hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                >
                    {isLoading ? (
                        <>
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Logging in...
                        </>
                    ) : 'Continue'}
                </button>

                <div className="text-center mt-2 text-[15px] text-[#071343] font-medium">
                    Don't have an account? <Link to="/signup" className="text-[#0047fb] font-bold hover:underline">Sign up</Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans relative">
            <div className="flex-grow flex flex-col overflow-y-auto overflow-x-hidden">

                {/* Minimal Header */}
                <header className="p-6 relative z-20">
                    <Link to="/" className="text-[#0047fb] font-black text-3xl tracking-tighter inline-block cursor-pointer">
                        TaskDone
                    </Link>
                </header>

                {/* Form Container */}
                <main className="flex-grow flex flex-col items-center justify-center -mt-16 px-4 py-12 relative z-10 w-full">
                    <form className="w-full flex justify-center" onSubmit={(e) => e.preventDefault()}>
                        {step === 1 ? renderStep1() : renderStep2()}
                    </form>
                </main>

            </div>

            {/* Footer sticky to bottom layout */}
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

export default Login;
