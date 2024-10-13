import React, { useEffect, useState } from 'react';
import useUserData from './context/useUserData';
import './css/Home.css';

const Home: React.FC = () => {
  const { profile, incrementXP } = useUserData();
  const [date, setDate] = useState(new Date());

  const renderCalendar = () => {
    const calendarBody = document.getElementById('calendar-body');
    if (!calendarBody) return;

    calendarBody.innerHTML = '';
    const month = date.getMonth();
    const firstDay = new Date(date.getFullYear(), month, 1).getDay();
    const daysInMonth = new Date(date.getFullYear(), month + 1, 0).getDate();

    // render empty slots for days before the first of the month
    for (let i = 0; i < firstDay; i++) {
      calendarBody.innerHTML += `<div class="calendar-day"></div>`;
    }

    // render the days
    for (let i = 1; i <= daysInMonth; i++) {
      calendarBody.innerHTML += `<div class="calendar-day">${i}</div>`;
    }
  };

  renderCalendar();

  useEffect(() => {
    if (profile) {
      updateXpBar();
    }
  }, [profile]);

  const updateXpBar = () => {

    if (!profile) return;

    const xpBarFill = document.getElementById('xp-bar-fill') as HTMLDivElement;
    const xpToNextLevel = profile.level * 100;
    const fillWidth = (profile.xp / xpToNextLevel) * 100;
    if (xpBarFill) xpBarFill.style.width = `${fillWidth}%`;
  };

  const checkLevelUp = () => {
    if (!profile) return;

    const xpToNextLevel = profile.level * 100;
    if (profile.xp >= xpToNextLevel) {
      incrementXP(0);
      alert(`Congratulations! You've reached level ${profile.level + 1}!`);
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
  


  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <header>
        <h1 className="welcome">Welcome, {profile.name}!</h1>
      </header>

      <div className="stats">
        <div className="stat-container">
          <div className="stat">
            <div className="stat-circle" id="level">{profile.level}</div>
            <div className="stat-label">Level</div>
          </div>
          <div className="stat">
            <div className="stat-circle" id="xp">{profile.xp}</div>
            <div className="stat-label">XP</div>
          </div>
          <div className="stat">
            <div className="stat-circle" id="streak">{profile.streak}</div>
            <div className="stat-label">Streak</div>
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
