import React from 'react';

const Membership = () => {
    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
            <div className="bg-[#d1f7aa] rounded-[32px] mx-auto relative overflow-hidden px-8 py-12 md:py-16 md:px-16 shadow-sm flex flex-col md:flex-row items-center justify-between">

                {/* Decorative background lines (subtle curved lines) */}
                <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-20 pointer-events-none">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-green-700 fill-current">
                        <path d="M0 100 C 20 50, 60 50, 100 0 L 100 100 Z" className="opacity-10" />
                        <path d="M20 100 C 40 70, 70 70, 100 20 L 100 100 Z" className="opacity-10" />
                        <path d="M40 100 C 60 80, 80 80, 100 40 L 100 100 Z" className="opacity-10" />
                    </svg>
                </div>

                {/* Left Side Content */}
                <div className="relative z-10 max-w-xl mb-10 md:mb-0">
                    <div className="flex items-center space-x-2 text-xl md:text-2xl font-bold mb-4">
                        <span className="text-gray-900 tracking-tight">Airtasker</span>
                        <span className="text-[#0047fb]">Membership</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#071343] leading-[1.05] tracking-tighter mb-8">
                        Unlock ₹0 Connection Fees<br className="hidden md:block" /> all year round.
                    </h2>

                    <div className="mb-4">
                        <button className="bg-[#0047fb] text-white px-8 py-3.5 rounded-full font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center w-full sm:w-auto">
                            Join now <span className="ml-2">→</span>
                        </button>
                    </div>

                    <p className="text-sm text-[#071343] font-semibold">
                        Membership ₹89/yr. <a href="#" className="underline hover:text-[#0047fb]">T&Cs apply</a>.
                    </p>
                </div>

                {/* Right Side Card Graphic */}
                <div className="relative z-10 w-full max-w-[400px] md:w-1/2 flex justify-center md:justify-end">
                    {/* Card Mockup */}
                    <div className="w-full aspect-[1.586] bg-gradient-to-br from-[#071343] to-[#1a2f7d] rounded-2xl shadow-2xl relative overflow-hidden text-white p-6 md:p-8 flex flex-col justify-between transform rotate-1 hover:rotate-0 transition duration-300">
                        {/* Card internal swoosh */}
                        <div className="absolute inset-0 opacity-20">
                            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-white fill-current">
                                <path d="M0 60 Q 50 10, 100 80 L 100 100 L 0 100 Z" />
                            </svg>
                        </div>

                        <div className="relative z-10 flex justify-end">
                            {/* Fake 'A' logo for card */}
                            <div className="text-3xl font-black italic tracking-tighter opacity-80">A</div>
                        </div>

                        <div className="relative z-10 mt-auto">
                            <div className="text-xs tracking-widest uppercase opacity-70 mb-1">Airtasker Member</div>
                            {/* Subtle card chip or element could go here, omitting for simplicity */}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Membership;
