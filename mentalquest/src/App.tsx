import { useState } from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from '../frontend/Home';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const App: React.FC =() => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
