import React, {useState, useEffect} from 'react';
import './css/Home.css';


const Home: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);
    const [streak, setStreak] = useState(0);
    const [date, setDate] = useState(new Date());

    const toggleMode = () => {
        setDarkMode(!darkMode);
    };

    useEffect(()=>{
        updateXpBar();
    }, [xp, level]);

    const updateXpBar = () => {
        const xpBarFill = document.getElementById('xp-bar-fill') as HTMLDivElement;
        const xpToNextLevel = level * 100;
        const fillWidth = (xp / xpToNextLevel) * 100;
        if (xpBarFill) xpBarFill.style.width = `${fillWidth}%`;
    };

    const checkLevelUp = () => {
        const xpToNextLevel = level * 100;
        if (xp >= xpToNextLevel) {
            setLevel(level + 1);
            setXp(xp - xpToNextLevel);
            alert(`Congratulations! You've reached ${level + 1}!`)
        }
    };

    const renderCalendar = () => {
        const calendarBody = document.getElementById('calendar-body');
        if (!calendarBody) return;

        calendarBody.innerHTML = '';
        const month = date.getMonth();
        const firstDay = new Date(date.getFullYear(), month, 1).getDay();
        const daysInMonth = new Date(date.getFullYear(), month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            calendarBody.innerHTML += `<div class="calendar-day"></div>`;
        }

        for (let i = 1; i <= daysInMonth; i++) {
            calendarBody.innerHTML += `<div class="calendar-day">${i}</div>`;
        }
    };

        useEffect(() => {
            renderCalendar();
        }, [date]);
        
        const handlePrevMonth = () => {
            setDate(new Date(date.setMonth(date.getMonth() - 1)));
        };
        
        const handleNextMonth = () => {
            setDate(new Date(date.setMonth(date.getMonth() + 1)));
        };

    


    return (
        <div className={`container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <header>
          <h1 className="welcome">Welcome, User!</h1>
          <div className="toggle-container">
            <span className="toggle-label">Dark Mode</span>
            <label className="toggle">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleMode}
              />
              <span className="slider"></span>
            </label>
          </div>
        </header>
  
        <div className="stats">
          <div className="stat-container">
            <div className="stat">
              <div className="stat-circle" id="level">{level}</div>
              <div className="stat-label">Level</div>
            </div>
            <div className="stat">
              <div className="stat-circle" id="xp">{xp}</div>
              <div className="stat-label">XP</div>
            </div>
            <div className="stat">
              <div className="stat-circle" id="streak">{streak}</div>
              <div className="stat-label">Day Streak</div>
            </div>
          </div>
          <div className="xp-bar">
            <div className="xp-bar-fill" id="xp-bar-fill"></div>
          </div>
        </div>
  
        <div className="main-content">
          <div className="calendar">
            <div className="calendar-header">
              <button className="calendar-button" onClick={handlePrevMonth}>&lt;</button>
              <span id="current-month">{date.toLocaleDateString('default', { month: 'long', year: 'numeric' })}</span>
              <button className="calendar-button" onClick={handleNextMonth}>&gt;</button>
            </div>
            <div className="calendar-body" id="calendar-body">
            </div>
          </div>
          <div className="motivation">
            <div className="quote">"Keep going. Everything you need will come to you at the perfect time."</div>
            <div className="author">— Anonymous</div>
          </div>
        </div>
      </div>
    );

};


export default Home;