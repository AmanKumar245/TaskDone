import React from 'react';

const taskerCards = [
    {
        name: "STAR",
        rating: "4.7",
        reviews: "17 reviews",
        completion: "95%",
        tasks: "17 tasks",
        specialities: "residential, end of lease and commercial cleaning",
        bio: "Star joined Airtasker when she was told by friends that it was a great place to find work. As a migrant, it gave her a head start. She really enjoys using the Airtasker app to get work fast to suit her needs.",
        badges: ["Payment Method", "Mobile"],
        reviewText: "I can't recommend Star highly enough. She is thorough, does everything to a high standard, has great communication and is very reliable.",
        reviewer: "- Pauline A.",
        img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop"
    },
    {
        name: "GEOFF",
        rating: "5",
        reviews: "208 ratings",
        completion: "95%",
        tasks: "208 tasks",
        specialities: "gardener, mixologist, chef, cleaner",
        bio: "Geoff is keen to beat the bias of ageism and Airtasker is the perfect platform where he could be in control. He enjoys the flexibility so he can still pursue his passion in arts, acting and writing.",
        badges: ["Payment Method", "Mobile"],
        reviewText: "We hired Geoff to give our indoor plants some care and attention. Geoff worked hard to clean, trim and repot our plants, and they now look healthier and happier than they did before.",
        reviewer: "- Art H.",
        img: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=600&fit=crop"
    }
];

const BeYourOwnBoss = () => {
    return (
        <div className="bg-[#0047fb] text-white py-16 md:py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Top Section */}
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-8 items-center mb-24">

                    {/* Left: Text & List */}
                    <div className="w-full lg:w-1/2 md:pr-12">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1] tracking-tighter mb-6">
                            Be your own boss
                        </h2>
                        <p className="font-bold text-lg leading-snug mb-8 max-w-md">
                            Whether you're a genius spreadsheet guru or a diligent carpenter, find your next job on Airtasker.
                        </p>

                        <ul className="space-y-4 mb-10 font-bold text-sm md:text-base">
                            {[
                                "Free access to thousands of job opportunities",
                                "No subscription or credit fees",
                                "Earn extra income on a flexible schedule",
                                "Grow your business and client base"
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <button className="bg-white text-[#0047fb] px-8 py-3.5 rounded-full font-bold text-lg hover:bg-gray-100 transition w-full sm:w-auto">
                            Earn money as a Tasker
                        </button>
                    </div>

                    {/* Right: Image Composition */}
                    <div className="w-full lg:w-1/2 relative flex justify-center mt-10 lg:mt-0">
                        {/* Base Image Container */}
                        <div className="relative z-0 w-[70%] max-w-[350px] rounded-3xl overflow-hidden aspect-[3/4]">
                            <img src="https://images.unsplash.com/photo-1595966453965-f8a41bf37db2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Tasker painting" className="w-full h-full object-cover" />
                        </div>

                        {/* Float: Payment Received */}
                        <div className="absolute top-4 right-0 lg:-right-8 bg-white text-gray-900 rounded-xl p-4 shadow-xl w-64 z-10">
                            <div className="text-xs font-bold text-gray-500 mb-2">Payment received!</div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="font-bold text-sm">Paint chairs</div>
                                    <div className="text-xs text-gray-400">2h ago</div>
                                </div>
                                <div className="text-xl font-black text-[#071343]">₹179</div>
                            </div>
                        </div>

                        {/* Float: New Job Alert */}
                        <div className="absolute top-24 -right-4 lg:-right-12 bg-[#d1f7aa] text-[#071343] rounded-full px-4 py-2 font-bold text-sm shadow-xl flex items-center gap-2 z-10 transform rotate-2">
                            <span>🔔</span> New job alert!
                        </div>

                        {/* Float: Total Earnings Graph */}
                        <div className="absolute bottom-8 -left-4 lg:-left-12 bg-white text-gray-900 rounded-xl p-5 shadow-xl w-48 z-10">
                            <div className="text-xs font-bold text-gray-500 mb-2">Total earnings</div>
                            {/* Mock Graph */}
                            <div className="h-10 w-full mb-2">
                                <svg viewBox="0 0 100 30" width="100%" height="100%" preserveAspectRatio="none">
                                    <path d="M0 20 Q 15 25, 30 15 T 60 20 T 100 5" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div className="font-black text-2xl text-[#071343] tracking-tighter">₹13,066</div>
                            <div className="text-xs font-bold text-green-500 mt-1">↑ 25% vs last month</div>
                        </div>

                        {/* Abstract Decorative Graphics around bottom right */}
                        <div className="absolute bottom-0 right-8 lg:-right-4 opacity-50 pointer-events-none">
                            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="60" cy="60" r="50" stroke="white" strokeWidth="4" className="opacity-20" />
                                <path d="M40 80C50 60 70 60 100 70" stroke="white" strokeWidth="4" strokeLinecap="round" className="opacity-40" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mb-10">
                    <h3 className="text-3xl md:text-5xl font-black leading-[1.05] tracking-tighter mb-4 max-w-2xl">
                        160,000 Taskers have earned an income on Airtasker
                    </h3>
                    <p className="font-bold text-sm md:text-base opacity-90">
                        Start earning with Australia's trusted local services marketplace.
                    </p>
                </div>

                {/* Tasker Cards Grid */}
                <div className="flex overflow-x-auto gap-6 pb-8 no-scrollbar md:grid md:grid-cols-2 md:overflow-visible md:pb-0">
                    {taskerCards.map((card, idx) => (
                        <div key={idx} className="bg-white text-gray-900 rounded-3xl overflow-hidden flex flex-col sm:flex-row w-[90vw] sm:w-[600px] md:w-auto flex-shrink-0 shadow-lg">
                            {/* Card Image */}
                            <div className="w-full sm:w-2/5 h-64 sm:h-auto overflow-hidden">
                                <img src={card.img} alt={card.name} className="w-full h-full object-cover" />
                            </div>

                            {/* Card Content */}
                            <div className="w-full sm:w-3/5 p-6 md:p-8 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-black text-2xl mb-4 text-[#071343]">{card.name}</h4>

                                    <div className="flex gap-6 mb-6">
                                        <div>
                                            <div className="flex items-center gap-1 font-black text-lg text-[#071343]">
                                                {card.rating} <span className="text-orange-500">★</span>
                                            </div>
                                            <div className="text-[10px] font-bold text-gray-500 leading-tight">
                                                Overall Rating<br />{card.reviews}
                                            </div>
                                        </div>
                                        <div className="w-px bg-gray-200"></div>
                                        <div>
                                            <div className="font-black text-lg text-[#071343]">{card.completion}</div>
                                            <div className="text-[10px] font-bold text-gray-500 leading-tight">
                                                Completion rate<br />{card.tasks}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-xs font-bold text-[#071343] mb-1">Specialities: {card.specialities}</div>
                                        <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                            {card.bio}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-6">
                                        {card.badges.map(badge => (
                                            <span key={badge} className="bg-blue-50 text-[#0047fb] text-[10px] font-bold px-3 py-1.5 rounded flex items-center gap-1">
                                                💳 {badge}
                                            </span>
                                        ))}
                                    </div>

                                    <div>
                                        <div className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wide">What the reviews say</div>
                                        <p className="text-xs font-bold text-[#071343] leading-snug mb-2">"{card.reviewText}"</p>
                                        <div className="text-xs font-bold text-gray-500">{card.reviewer}</div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default BeYourOwnBoss;
