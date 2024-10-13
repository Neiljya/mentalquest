import { useState, useEffect } from 'react';
import axios from 'axios';

// Custom hook to manage user data
export const useUserData = () => {
  // Initialize profile as null to handle loading state
  const [profile, setProfile] = useState(null);

  // Function to set user data with defaults
  const setUserData = (data) => {
    setProfile({
      _id: data._id || '', // Include _id for future requests
      name: data.name || 'Unknown',
      email: data.email || 'unknown@example.com',
      level: data.level || 1,
      streak: data.streak || 0,
      tasks: data.tasks || [],
      xp: data.xp || 0,
    });
  };

  // Fetch user data when the component mounts
  useEffect(() => {
    // Make an API call to get the first user
    axios
      .get('http://localhost:4000/users/first')
      .then((response) => {
        console.log('Fetched user data:', response.data);
        setUserData(response.data); // Set the fetched data in the state
      })
      .catch((error) => {
        console.error('Failed to fetch user data:', error);
      });
  }, []);

  // Function to toggle task completion
  const toggleTaskCompletion = (taskId) => {
    if (!profile) return;

    const updatedTasks = profile.tasks.map((task) =>
      task._id === taskId ? { ...task, completed: !task.completed } : task
    );
    setProfile({ ...profile, tasks: updatedTasks });

    // Send an update to the server
    axios
      .patch(`http://localhost:4000/user/${profile._id}/task/${taskId}`, {
        completed: !profile.tasks.find((task) => task._id === taskId).completed,
      })
      .then((response) => {
        console.log('Task updated successfully:', response.data);
      })
      .catch((error) => {
        console.error('Failed to update task:', error);
      });
  };

  // Function to increment XP and handle leveling up
  const incrementXP = (additionalXP) => {
    if (!profile) return;

    let newLevel = profile.level;
    let newXp = profile.xp + additionalXP;

    // Basic level-up logic
    const xpToNextLevel = 100;
    while (newXp >= xpToNextLevel) {
      newXp -= xpToNextLevel;
      newLevel += 1;
    }

    setProfile({ ...profile, xp: newXp, level: newLevel });

    // Update XP and level on the server
    axios
      .patch(`http://localhost:4000/user/${profile._id}/xp`, {
        xp: newXp,
        level: newLevel,
      })
      .then((response) => {
        console.log('XP updated successfully:', response.data);
      })
      .catch((error) => {
        console.error('Failed to update XP:', error);
      });
  };

  // Return the profile and functions to be used in components
  return { profile, toggleTaskCompletion, incrementXP };
};

export default useUserData;