import React from 'react';
import Day from './Tasks/Day';
import './Planner.css'; 

function Planner() {
  return (
    <div className="App">
      <h1>Weekly Planner App</h1>
      <div className="planner-container">
        <Day filterDay="Sunday" />
        <Day filterDay="Monday" />
        <Day filterDay="Tuesday" />
        <Day filterDay="Wednesday" />
        <Day filterDay="Thursday" />
        <Day filterDay="Friday" />
        <Day filterDay="Saturday" />
      </div>
    </div>
  );
}

export default Planner;
