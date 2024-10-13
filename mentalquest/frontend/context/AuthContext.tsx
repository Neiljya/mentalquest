import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the AuthContext
const AuthContext = createContext(null);

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('authUser');
        if (savedUser) {
            return JSON.parse(savedUser);
        } else {
            const mockUser = {
                id: '670b366efeeb42de79f96a05',
                name: 'mentalquest',
                email: 'mentalquest@gmail.com',
                level: 20,
                streak: 0,
                xp: 0
            };
            localStorage.setItem('authUser', JSON.stringify(mockUser));
            return mockUser;
        }
    });

    useEffect(() => {
        if (user) {
            // Save user to localStorage when user state changes
            localStorage.setItem('authUser', JSON.stringify(user));
        } else {
            // Remove user from localStorage on logout
            localStorage.removeItem('authUser');
        }
    }, [user]);

    // Function to login (mocked for now)
    const login = (userData) => {
        setUser(userData); // Set user state
    };

    // Function to logout
    const logout = () => {
        setUser(null); // Clear user state
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };
