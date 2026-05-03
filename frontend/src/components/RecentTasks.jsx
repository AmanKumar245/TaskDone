import React from 'react';

const tabs = [
    { id: 1, label: 'Moving in', active: true, icon: '🏠' },
    { id: 2, label: 'Home maintenance', active: false, icon: '🛠️' },
    { id: 3, label: 'Starting a business', active: false, icon: '💼' },
    { id: 4, label: 'Parties', active: false, icon: '🎉' },
    { id: 5, label: 'Something different', active: false, icon: '✨' },
];

const mockTasks = [
    { id: 1, category: 'DELIVERY', title: 'Sofa delivery', userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50&h=50&fit=crop', price: '₹95', rating: '5 Stars' },
    { id: 2, category: 'CLEANING', title: 'End of lease clean', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop', price: '₹450', rating: '5 Stars' },
    { id: 3, category: 'REMOVALS', title: 'Couch moved 1km down the road', userAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=50&h=50&fit=crop', price: '₹60', rating: '5 Stars' },
    { id: 4, category: 'REMOVALS', title: 'Removalist TODAY', userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop', price: '₹506', rating: '5 Stars' },
    { id: 5, category: 'REMOVALS', title: 'Urgent removalist', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop', price: '₹450', rating: '5 Stars' },
    { id: 6, category: 'HANDYMAN', title: 'Fix broken door hinge', userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop', price: '₹120', rating: '5 Stars' },
];

// Duplicate for infinite scroll
const scrollingTasks = [...mockTasks, ...mockTasks];

const RecentTasks = () => {
    return (
        <div className="py-16 md:py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Heading */}
                <h2 className="text-3xl md:text-5xl font-black text-[#071343] tracking-tighter mb-8 text-center md:text-left">
                    See what others are getting done
                </h2>

                {/* Tabs */}
                <div className="flex overflow-x-auto pb-4 mb-8 no-scrollbar md:pb-0 md:border-b md:border-gray-200">
                    <div className="flex space-x-2 md:space-x-8 min-w-max px-2 md:px-0">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`flex items-center gap-2 py-3 px-1 md:px-0 text-sm font-bold transition-all border-b-2 ${tab.active
                                        ? 'text-[#0047fb] border-[#0047fb]'
                                        : 'text-[#071343] border-transparent hover:text-[#0047fb]'
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Scrolling Container */}
            <div className="relative w-full overflow-hidden mt-4 group">
                <div className="flex w-max animate-scroll gap-4 px-4 sm:px-6">
                    {scrollingTasks.map((task, idx) => (
                        <div
                            key={`${task.id}-${idx}`}
                            className="bg-[#f2f5fb] rounded-xl p-5 min-w-[300px] w-[300px] md:min-w-[340px] md:w-[340px] flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                        <img src={task.userAvatar} alt="user" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">{task.category}</div>
                                        <div className="text-sm font-bold text-[#071343] leading-tight line-clamp-2 mt-0.5">{task.title}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mt-4">
                                <div className="flex items-center gap-1 text-xs font-bold text-gray-700 bg-white px-2 py-1 rounded-full shadow-sm">
                                    <span className="text-orange-500">★</span> {task.rating}
                                </div>
                                <div className="text-xl font-black text-[#071343]">{task.price}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Button */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16 flex justify-start md:justify-start">
                <button className="bg-[#0047fb] text-white px-8 py-3.5 rounded-full font-bold text-lg hover:bg-blue-700 transition">
                    Post your task for free
                </button>
            </div>

        </div>
    );
};

export default RecentTasks;
