import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useHttpClient } from '../Database/http-hook';
import ReactDOM from 'react-dom';

const DisplayTask = ({ onClose, taskId, refreshTasks }) => {
    const [task, setTask] = useState(null);
    const { isLoading, sendRequest } = useHttpClient();
    const history = useHistory();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:3001/api/tasks/${taskId}`,
                    "GET",
                    null,
                    { 'Content-Type': 'application/json' }
                );
                console.log(responseData); // Debug: log the response data
                setTask(responseData.task); // Ensure responseData.task is correct
            } catch (err) {
                console.error(err);
            }
        };

        fetchTasks();
    }, [sendRequest, taskId]);

    const deleteTask = async () => {
        try {
            await sendRequest(
                `http://localhost:3001/api/tasks/delete/${taskId}`,
                "DELETE",
                null,
                { 'Content-Type': 'application/json' }
            );
            refreshTasks();
            onClose(); // Close the modal after deleting
        } catch (err) {
            console.error(err);
        }
    };

    const deleteHandler = () => {
        deleteTask();
    };

    const renderTaskContent = () => {
        if (task == null) {
            return (
                <>
                    <p>No Task Found</p>
                    <button style={buttonStyle} onClick={deleteHandler}>DELETE TASK</button>
                    <button style={buttonStyle} onClick={onClose}>CLOSE</button>
                </>
            );
        } else {
            return (
                <>
                    <p><strong>Title:</strong> {task.title}</p>
                    <p><strong>Description:</strong> {task.description}</p>
                    <p><strong>Day of Week:</strong> {task.dayOfWeek}</p>
                    <p><strong>Time:</strong> {task.time.hour}:{task.time.min}</p>
                    <button style={buttonStyle} onClick={deleteHandler}>DELETE TASK</button>
                    <button style={buttonStyle} onClick={onClose}>CLOSE</button>
                </>
            );
        }
    };

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    };

    const modalStyle = {
        color: 'rgb(255, 111, 0)', // Orange text color
        backgroundColor: 'rgb(57, 56, 56)', // Dark grey background
        padding: '20px',
        borderRadius: '8px',
        border: '2px solid rgb(255, 111, 0)', // Orange border
        width: '80%', // Adjust width as needed
        maxWidth: '500px', // Maximum width
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
        zIndex: 1001
    };

    const buttonStyle = {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: 'rgb(255, 111, 0)',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    };

    return ReactDOM.createPortal(
        <>
            <div style={overlayStyle} onClick={onClose}>
                <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                    {renderTaskContent()}
                </div>
            </div>
        </>,
        document.getElementById('displayTask')
    );
};

export default DisplayTask;
