import React from 'react';
import { Link } from 'react-router-dom';

const DiscoverBanner = () => {
    return (
        <div className="bg-[#f3f6ff] py-16 text-center">
            <h2 className="text-[#071343] font-bold text-xl mb-4">
                Can't find what you need?
            </h2>
            <Link 
                to="/post-task" 
                className="inline-block bg-[#0047fb] text-white px-8 py-3.5 rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-sm"
            >
                Post a task & get offers
            </Link>
        </div>
    );
};

export default DiscoverBanner;
