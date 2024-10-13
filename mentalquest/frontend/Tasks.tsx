import React, { useState } from 'react';
import './css/Tasks.css';

const Tasks: React.FC = () => {
  const [progress, setProgress] = useState(0);

  const updateProgress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checkboxes = document.querySelectorAll('.task-checkbox');
    const completedTasks = document.querySelectorAll('.task-checkbox:checked');
    const percentComplete = (completedTasks.length / checkboxes.length) * 100;
    setProgress(percentComplete);

    checkboxes.forEach(task => {
      const parent = (task as HTMLInputElement).parentElement;
      if (parent) {
        parent.classList.toggle('completed', (task as HTMLInputElement).checked);
      }
    });

    const completeQuestBtn = document.getElementById('complete-quest-btn');
    if (completedTasks.length === checkboxes.length) {
      completeQuestBtn?.classList.add('active');
    } else {
      completeQuestBtn?.classList.remove('active');
    }
  };

  const completeQuest = () => {
    alert('Congratulations! You have completed all tasks for today!');
  };

  return (
    <div className="tasks-page">
      <header>
        <h1>Today's Quests</h1>
      </header>

      <div className="tasks-section">
        <div className="tasks-container">
          <div className="task-item">
            <input type="checkbox" className="task-checkbox" onChange={updateProgress} />
            <span>Task 1: Meditate for 10 minutes</span>
          </div>
          <div className="task-item">
            <input type="checkbox" className="task-checkbox" onChange={updateProgress} />
            <span>Task 2: Read 20 pages</span>
          </div>
          <div className="task-item">
            <input type="checkbox" className="task-checkbox" onChange={updateProgress} />
            <span>Task 3: Journal your thoughts</span>
          </div>
        </div>

        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>

        <button className="complete-quest-btn" id="complete-quest-btn" onClick={completeQuest}>
          Complete Quest
        </button>
      </div>
    </div>
  );
};

export default Tasks;
