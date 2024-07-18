import './App.css';
import React, { useState, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import Planner from './Components/Planner';

function App() {
  const userId = "u1";
  
  return (
    <div className="App">
      
      <Router>
        <Switch>
          <Route path={'/'} exact>
            <Redirect to={'/u1'}/>
          </Route>
          <Route path={'/:userId'} exact>
            <Planner />
          </Route>
          <Redirect to={'/:userId'}/>
        </Switch>
      </Router>
    </div>
    
  );
}

export default App;
