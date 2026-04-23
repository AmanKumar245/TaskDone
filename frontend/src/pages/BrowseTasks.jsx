import React from 'react';
import { useParams } from 'react-router-dom';
import TaskFilterBar from '../components/TaskFilterBar';
import TaskList from '../components/TaskList';
import TaskMap from '../components/TaskMap';
import TaskDetail from '../components/TaskDetail';

const BrowseTasks = () => {
  const { taskId } = useParams();

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]"> {/* Adjust height assuming Header is roughly 80px */}
      <TaskFilterBar />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Task List Column: Full width on mobile if NO taskId, otherwise hidden on mobile but fixed width on desktop */}
        <div className={`w-full md:w-1/2 lg:w-[400px] flex-shrink-0 border-r border-gray-200 h-full ${taskId ? 'hidden md:block' : 'block'}`}>
          <TaskList />
        </div>
        {/* Detail/Map Column: Hidden on mobile if NO taskId, otherwise flex-1 */}
        <div className={`flex-1 w-full bg-gray-100 overflow-y-auto h-full ${taskId ? 'block' : 'hidden md:block'}`}>
          {taskId ? <TaskDetail taskId={taskId} /> : <TaskMap />}
        </div>
      </div>
    </div>
  );
};

export default BrowseTasks;
