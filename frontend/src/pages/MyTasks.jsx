import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskCard from '../components/TaskCard';

const MyTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch('/api/tasks/myTasks', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }

                const data = await response.json();
                setTasks(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyTasks();
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <span className="w-12 h-12 border-4 border-[#0047fb] border-t-transparent rounded-full animate-spin"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 min-h-[50vh] flex items-center justify-center">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-12">
            <div className="max-w-5xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-[#001D4A] mb-8">My Tasks</h1>
                
                {tasks.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl border border-gray-200 text-center shadow-sm">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        <h2 className="text-xl font-bold text-[#001D4A] mb-2">You haven't posted any tasks yet</h2>
                        <p className="text-gray-500 mb-6">Need something done? Get offers from trusted Taskers.</p>
                        <button onClick={() => navigate('/post-task')} className="bg-[#0057FF] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors">
                            Post a task
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.map(task => {
                            let scheduleStr = 'Flexible';
                            if (task.dateType === 'on_date') scheduleStr = `On ${task.selectedDate}`;
                            if (task.dateType === 'before_date') scheduleStr = `Before ${task.selectedDate}`;
                            
                            const locationStr = task.locationType === 'online' ? 'Remote' : (task.suburb || 'In-person');

                            return (
                                <TaskCard 
                                    key={task._id} 
                                    id={task._id}
                                    title={task.title}
                                    price={task.budget}
                                    location={locationStr}
                                    schedule={scheduleStr}
                                    status={task.status === 'open' ? 'Open' : (task.status === 'assigned' ? 'Assigned' : 'Completed')}
                                    offers={task.offers ? task.offers.length : 0}
                                    avatar={task.user?.avatar || `https://i.pravatar.cc/150?u=${task._id}`}
                                    onClick={() => navigate(`/my-tasks/${task._id}`)}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTasks;
