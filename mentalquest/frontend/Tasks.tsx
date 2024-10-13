import React, { useState, useEffect } from 'react';
import './css/Tasks.css';

interface Task {
  id: number;
  title: string;
  xp_reward: number;
  completed: boolean;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState(0);

  // Fetch tasks from the backend when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/generate_tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        if (response.ok) {
          const tasksData = data.generated_tasks;
          setTasks(tasksData);
        } else {
          console.error('Error fetching tasks:', data.error);
          alert('Error fetching tasks. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('Error fetching tasks. Please try again.');
      }
    };

    fetchTasks();
  }, []);

  // Update progress whenever tasks change
  useEffect(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const percentComplete = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    setProgress(percentComplete);
  }, [tasks]);

  const updateProgress = (event: React.ChangeEvent<HTMLInputElement>, taskId: number) => {
    const isChecked = event.target.checked;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: isChecked } : task
      )
    );
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
          {tasks.map((task) => (
            <div className={`task-item ${task.completed ? 'completed' : ''}`} key={task.id}>
              <input
                type="checkbox"
                className="task-checkbox"
                checked={task.completed}
                onChange={(e) => updateProgress(e, task.id)}
              />
              <span>{task.title}</span>
            </div>
          ))}
        </div>

        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>

        <button
          className={`complete-quest-btn ${progress === 100 ? 'active' : ''}`}
          onClick={completeQuest}
        >
          Complete Quest
        </button>
      </div>
    </div>
  );
};

export default Tasks;
