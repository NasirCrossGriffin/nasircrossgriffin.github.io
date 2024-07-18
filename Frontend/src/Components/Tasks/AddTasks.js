import React from 'react';
import { useHistory } from 'react-router-dom';
import Input from '../Database/Input';
import Button from '../Database/Button';
import ReactDOM from 'react-dom';
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH,
    VALIDATOR_MIN,
    VALIDATOR_MAX
} from '../Database/validators';
import { useForm } from '../Database/form-hook';
import { useHttpClient } from '../Database/http-hook';
import './AddTasks.css'; // Import your CSS file with the modal styles

const AddTasks = ({ onClose, refreshTasks, filterDay }) => {
    const { isLoading, sendRequest } = useHttpClient();
    const history = useHistory();
    
    const [formState, inputHandler] = useForm(
        {
            title: { value: '', isValid: false },
            description: { value: '', isValid: false },
            hours: { value: '', isValid: false },
            minutes: { value: '', isValid: false }
        },
        false
    );

    const validDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    const TaskSubmitHandler = async event => {
        event.preventDefault();
        try {
            await sendRequest(
                "http://localhost:3001/api/tasks", 
                "POST",
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                    dayOfWeek: filterDay,
                    time: {
                        "hour": formState.inputs.hours.value,
                        "min": formState.inputs.minutes.value
                    },   
                    creator: "u1"
                }),
                {
                    'Content-Type' : 'application/json'
                }
            );
            refreshTasks(); // Refresh the task list after adding a task
            onClose(); // Close the modal after adding a task
        } catch (err) {
            console.error("Error adding task:", err);
        }
    };

    return ReactDOM.createPortal(
        <>
            <div className="Overlay" onClick={onClose}></div>
            <div className="AddTasks">
                <form className="Task-form" onSubmit={TaskSubmitHandler}>
                    <Input
                        id="title"
                        element="input"
                        type="text"
                        label="Title"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a valid title."
                        onInput={inputHandler}
                        className="form-control"
                    />
                    <Input
                        id="description"
                        element="textarea"
                        label="Description"
                        validators={[VALIDATOR_MINLENGTH(5)]}
                        errorText="Please enter a valid description (at least 5 characters)."
                        onInput={inputHandler}
                        className="form-control"
                    />
                    <Input
                        id="hours"
                        element="input"
                        type="number"
                        label="Hours"
                        validators={[VALIDATOR_MIN(0), VALIDATOR_MAX(23)]}
                        errorText="Please enter valid hours (0-23)."
                        onInput={inputHandler}
                        className="form-control"
                    />
                    <Input
                        id="minutes"
                        element="input"
                        type="number"
                        label="Minutes"
                        validators={[VALIDATOR_MIN(0), VALIDATOR_MAX(59)]}
                        errorText="Please enter valid minutes (0-59)."
                        onInput={inputHandler}
                        className="form-control"
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        ADD TASK
                    </Button>
                </form>
                <Button onClick={onClose}>CLOSE</Button>
            </div>
        </>,
        document.getElementById('addTask')
    );
};

export default AddTasks;
