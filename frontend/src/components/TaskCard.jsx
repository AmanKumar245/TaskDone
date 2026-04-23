import React from 'react';

const TaskCard = ({ title, price, location, schedule, status, offers, avatar, onClick, isSelected }) => {
  return (
    <div 
      onClick={onClick}
      className={`border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer mb-4 ${isSelected ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' : 'bg-white border-gray-200'}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 text-lg pr-4">{title}</h3>
        <span className="font-bold text-gray-900 text-xl">${price}</span>
      </div>
      
      <div className="flex items-center text-gray-500 text-sm mb-1">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        {location}
      </div>
      
      <div className="flex items-center text-gray-500 text-sm mb-4">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        {schedule}
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center space-x-2">
          <span className="text-blue-600 font-semibold text-sm">{status}</span>
          {offers && <span className="text-gray-400 text-sm">• {offers} offers</span>}
        </div>
        
        {avatar ? (
          <img src={avatar} alt="User Avatar" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
