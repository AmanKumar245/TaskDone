import React from 'react';

const TaskFilterBar = () => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm py-3 px-4 flex items-center gap-4">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search for a task" 
          className="bg-gray-100 rounded-full py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
        />
        <svg className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto text-sm">
        <button className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium">
          Category
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        <button className="flex items-center gap-1 px-3 py-2 text-blue-700 font-medium hover:bg-gray-100 rounded-md">
          50km Gore STL
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        <button className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium">
          Any price
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        <button className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium">
          Other filters (1)
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        <button className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium">
          Sort
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>
    </div>
  );
};

export default TaskFilterBar;
