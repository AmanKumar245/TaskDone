import React from 'react';
import DiscoverHero from '../components/DiscoverHero';
import DiscoverCategories from '../components/DiscoverCategories';
import DiscoverBanner from '../components/DiscoverBanner';

const Discover = () => {
    return (
        <div className="w-full flex-grow flex flex-col font-sans bg-white pb-10">
            <DiscoverHero />
            <DiscoverCategories />
            <DiscoverBanner />
            {/* The existing Footer is appended correctly by App.js outside of this page */}
        </div>
    );
};

export default Discover;
