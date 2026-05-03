import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';
import TaskCard from './TaskCard';

const TaskList = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axiosInstance.get('/tasks');
        setTasks(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <span className="w-8 h-8 border-4 border-[#0047fb] border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 h-full flex flex-col items-center justify-center">
        <p className="font-bold">Error loading tasks</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 h-full flex flex-col items-center justify-center">
        <p className="font-bold text-lg">No tasks found</p>
        <p className="text-sm">Be the first to post a task!</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 h-full overflow-y-auto">
      {tasks.map(task => {
        // Format schedule string
        let scheduleStr = 'Flexible';
        if (task.dateType === 'on_date') scheduleStr = `On ${task.selectedDate}`;
        if (task.dateType === 'before_date') scheduleStr = `Before ${task.selectedDate}`;
        
        // Format location
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
            offers={0} // Default to 0 for now
            avatar={task.user?.avatar || `https://i.pravatar.cc/150?u=${task._id}`}
            onClick={() => navigate(`/tasks/${task._id}`)}
            isSelected={taskId === task._id}
          />
        );
      })}
    </div>
  );
};

export default TaskList;
