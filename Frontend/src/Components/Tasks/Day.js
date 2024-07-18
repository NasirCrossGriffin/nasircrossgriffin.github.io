import './Day.css';
import { useState } from "react";
import TaskList from './TaskList';
import { useParams } from 'react-router-dom';

const Day = ({filterDay}) => {
    const [tasks, setTasks] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const updateTasks = (newTasks) => {
        setTasks(newTasks);
    }

    const clickHandler = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
    }


    return (
        <div className="Day">
            <h1>{filterDay}</h1>
            <TaskList filterDay={filterDay} userId={"u1"}/>
        </div>
    );
}

export default Day;
