import React from 'react';

const categories = [
    { title: "Handyperson", desc: "Help with home maintenance", img: "https://images.unsplash.com/photo-1581141849291-1125c7b692b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
    { title: "Business & admin", desc: "Help with accounting and tax returns", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
    { title: "Marketing & design", desc: "Help with website", img: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
    { title: "Something else", desc: "Wall mount art and paintings", img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
    { title: "Removalists", desc: "Packing, wrapping, moving and more!", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
    { title: "Home cleaning", desc: "Clean, mop and tidy your house", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
    { title: "Furniture assembly", desc: "Flatpack assembly and disassembly", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
    { title: "Deliveries", desc: "Urgent deliveries and courier services", img: "https://images.unsplash.com/photo-1524522173746-f628ba6e2338?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
    { title: "Gardening & landscaping", desc: "Mulching, weeding and tidying up", img: "https://images.unsplash.com/photo-1585320806297-979213426ae3?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
    { title: "Painting", desc: "Interior and exterior wall painting", img: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
];

const TaskCategories = () => {
    return (
        <div className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-8 items-start">

            
            <div className="w-full lg:w-[40%] pr-0 lg:pr-8 py-8 lg:sticky lg:top-8">
                <h2 className="text-4xl md:text-5xl lg:text-5xl font-black text-[#071343] leading-[1.05] tracking-tighter mb-6">
                    Post your first<br />task in seconds
                </h2>

                <p className="text-[#071343] font-semibold text-lg mb-8 leading-snug">
                    Save yourself hours and get your to-do list<br className="hidden lg:block" /> completed
                </p>

                <div className="space-y-6 mb-10">
                    {[
                        "Describe what you need done",
                        "Set your budget",
                        "Receive quotes and pick the best Tasker"
                    ].map((step, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0047fb] flex items-center justify-center font-bold flex-shrink-0 text-sm">
                                {index + 1}
                            </div>
                            <span className="text-[#071343] font-bold text-base">{step}</span>
                        </div>
                    ))}
                </div>

                <button className="bg-[#0047fb] text-white px-8 py-3.5 rounded-full font-bold text-lg hover:bg-blue-700 transition">
                    Post your task
                </button>
            </div>

            {/* Right Column: Categories Grid */}
            <div className="w-full lg:w-[60%] relative">
                {/* Light blue rounded background block for the grid area */}
                <div className="absolute inset-0 bg-[#f3f6ff] rounded-[32px] -m-6 md:-m-8 z-0"></div>

                <div className="relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categories.map((cat, idx) => (
                            <div key={idx} className="bg-white rounded-xl p-3 flex items-center gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition cursor-pointer">
                                <div className="w-[60px] h-[60px] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                    <img src={cat.img} alt={cat.title} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#071343] text-base leading-tight">{cat.title}</h3>
                                    <p className="text-gray-500 text-xs mt-0.5 leading-snug">{cat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center flex justify-center">
                        <a href="#" className="font-bold text-[#0047fb] hover:text-blue-800 transition flex items-center text-lg">
                            Learn how Airtasker works <span className="ml-2 font-normal">→</span>
                        </a>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default TaskCategories;
