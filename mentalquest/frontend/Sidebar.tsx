import React from 'react'
import './css/Sidebar.css';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {4
    return (
        <div className="sidebar-container">
            <h2 className="sidebar-title">MentalQuest</h2>
            <ul className="sidebar-options">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/goals">Goals</Link></li>
                <li><Link to="/tasks">Tasks</Link></li>
                <li><Link to="/journal">Journal</Link></li>
                <li><Link to="/settings">Settings</Link></li>
                <li><Link to="/auth">Logout</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;