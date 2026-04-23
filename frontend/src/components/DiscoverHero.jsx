import React from 'react';

const DiscoverHero = () => {
    return (
        <div className="bg-[#0047fb] min-h-[400px] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Top right darker blue abstract shape approximation */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#003be0] transform rotate-45 z-0 clip-path-polygon"></div>
            
            <div className="max-w-4xl w-full z-10 text-center relative pt-12">
                <h1 className="text-4xl md:text-5xl lg:text-[54px] font-black tracking-tighter text-white mb-8">
                    Post a task. Get it done.
                </h1>

                <div className="bg-white rounded-full p-2 flex flex-col md:flex-row shadow-lg mb-6 max-w-4xl mx-auto w-full">
                    <input 
                        type="text" 
                        placeholder="In a few words, what do you need done?" 
                        className="flex-grow bg-transparent border-none outline-none px-6 py-3 text-gray-900 text-lg rounded-full mb-2 md:mb-0"
                    />
                    <button className="bg-[#071343] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-900 transition flex items-center justify-center whitespace-nowrap">
                        Get Offers <span className="ml-2 font-normal">→</span>
                    </button>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                    <button className="border border-white text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-white hover:text-[#0047fb] transition flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        Help me move home
                    </button>
                    <button className="border border-white text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-white hover:text-[#0047fb] transition flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                        End of lease cleaning
                    </button>
                    <button className="border border-white text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-white hover:text-[#0047fb] transition flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Fix my washing machine
                    </button>
                    <button className="border border-white text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-white hover:text-[#0047fb] transition flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                        Mow my backyard
                    </button>
                    <div className="relative inline-block">
                        <select className="appearance-none bg-transparent border border-white text-white px-5 pr-8 py-2 rounded-full text-sm font-semibold hover:bg-white hover:text-[#0047fb] transition cursor-pointer outline-none">
                            <option value="" className="text-gray-900">More inspiration</option>
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-white hover:text-[#0047fb]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscoverHero;
