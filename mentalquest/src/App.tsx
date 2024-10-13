import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../frontend/Home';
import Tasks from '../frontend/Tasks';
import Sidebar from '../frontend/Sidebar';
import Goals from '../frontend/Goals'
import { AuthProvider } from '../frontend/context/AuthContext'; 
import './App.css';

const App: React.FC = () => {
  return (
      <Router>
        <div className="layout">
          <Sidebar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/goals" element={<Goals />} />
            </Routes>
          </div>
        </div>
      </Router>
  );
};

export default App;