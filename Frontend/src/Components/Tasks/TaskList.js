import React, { useEffect, useState } from 'react';
import { useHttpClient } from '../Database/http-hook.js';
import './TaskList.css';
import DisplayTask from './DisplayTask.js';
import AddTasks from './AddTasks.js';

const TaskList = ({ userId, filterDay }) => {
  const { isLoading, error, sendRequest } = useHttpClient();
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const refreshTasks = async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:3001/api/tasks/user/${userId}`,
        "GET",
        null,
        { 'Content-Type': 'application/json' }
      );
      console.log(responseData); // Debug: log the response data
      setTasks(responseData.tasks || []); // Ensure responseData.Tasks is an array
    } catch (err) {
      // Error handling is already managed in the hook
      setTasks([]); // Set an empty array in case of error
    }
  };

  useEffect(() => {
    refreshTasks();
  }, [sendRequest, userId]);

  if (error) {
    return (
      <div className="list-group-item">
        <p>{error}</p>
      </div>
    );
  }

  const viewTaskHandler = (id) => {
    setSelected(id);
    console.log(id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openAddTaskModal = () => {
    setIsAddOpen(true);
  };

  const closeAddTaskModal = () => {
    setIsAddOpen(false);
  };

  return (
    <div>
      <button 
        onClick={openAddTaskModal} 
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: 'rgb(255, 111, 0)',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Add Task
      </button>
      <ul className="list-group">
        {tasks
          .filter(task => task.dayOfWeek.toLowerCase() === filterDay.toLowerCase())
          .map(task => (
            <li 
              className="list-group-item" 
              key={task._id} 
              onClick={() => viewTaskHandler(task._id)}
              style={{
                backgroundColor: 'lightgrey',
                color: 'rgb(255, 111, 0)',
                marginBottom: '10px',
                padding: '10px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {task.title}
            </li>
          ))}
      </ul>
      {isOpen && (
        <div>
          <DisplayTask onClose={closeModal} taskId={selected} refreshTasks={refreshTasks} />
        </div>
      )}
      {isAddOpen && (
        <div>
          <AddTasks onClose={closeAddTaskModal} refreshTasks={refreshTasks} filterDay={filterDay} />
        </div>
      )}
    </div>
  );
};

export default TaskList;
