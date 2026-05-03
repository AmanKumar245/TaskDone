import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import TaskCard from '../components/TaskCard';

const MyTasks = () => {
    const [postedTasks, setPostedTasks] = useState([]);
    const [assignedTasks, setAssignedTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('posted');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllTasks = async () => {
            try {
                const [postedRes, assignedRes] = await Promise.all([
                    axiosInstance.get('/tasks/myTasks'),
                    axiosInstance.get('/tasks/assignedToMe'),
                ]);

                setPostedTasks(postedRes.data);
                setAssignedTasks(assignedRes.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch tasks');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllTasks();
    }, [navigate]);

    const getStatusLabel = (status) => {
        switch (status) {
            case 'open': return 'Open';
            case 'assigned': return 'Assigned';
            case 'completed_pending': return 'Review';
            case 'completed': return 'Completed';
            default: return status;
        }
    };

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

    const tasks = activeTab === 'posted' ? postedTasks : assignedTasks;

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-12">
            <div className="max-w-5xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-[#001D4A] mb-6">My Tasks</h1>

                {/* Tabs */}
                <div className="flex bg-gray-200 rounded-full p-1 mb-8 max-w-md">
                    <button
                        onClick={() => setActiveTab('posted')}
                        className={`flex-1 py-3 text-center rounded-full font-bold text-sm transition-all ${
                            activeTab === 'posted'
                                ? 'bg-[#001D4A] text-white shadow'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Posted by me <span className={activeTab === 'posted' ? 'text-blue-300' : 'text-gray-400'}>{postedTasks.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('assigned')}
                        className={`flex-1 py-3 text-center rounded-full font-bold text-sm transition-all ${
                            activeTab === 'assigned'
                                ? 'bg-[#001D4A] text-white shadow'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Assigned to me <span className={activeTab === 'assigned' ? 'text-blue-300' : 'text-gray-400'}>{assignedTasks.length}</span>
                    </button>
                </div>
                
                {tasks.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl border border-gray-200 text-center shadow-sm">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        {activeTab === 'posted' ? (
                            <>
                                <h2 className="text-xl font-bold text-[#001D4A] mb-2">You haven't posted any tasks yet</h2>
                                <p className="text-gray-500 mb-6">Need something done? Get offers from trusted Taskers.</p>
                                <button onClick={() => navigate('/post-task')} className="bg-[#0057FF] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors">
                                    Post a task
                                </button>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-[#001D4A] mb-2">No tasks assigned to you yet</h2>
                                <p className="text-gray-500 mb-6">Browse tasks and make offers to get started.</p>
                                <button onClick={() => navigate('/tasks')} className="bg-[#0057FF] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors">
                                    Browse tasks
                                </button>
                            </>
                        )}
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
                                    status={getStatusLabel(task.status)}
                                    offers={task.offers ? task.offers.length : 0}
                                    avatar={task.user?.avatar || `https://i.pravatar.cc/150?u=${task._id}`}
                                    onClick={() => activeTab === 'posted' 
                                        ? navigate(`/my-tasks/${task._id}`) 
                                        : navigate(`/tasks/${task._id}`)
                                    }
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
