import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context object
const ThemeContext = createContext();

// Create a custom hook to use the theme context easily in other components
export const useTheme = () => useContext(ThemeContext);

// Create the provider component
export const ThemeProvider = ({ children }) => {
    // State to hold the current theme. It checks localStorage first, otherwise defaults to 'dark'
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'dark';
    });

    // Effect to apply the theme class to the HTML element and save preference
    useEffect(() => {
        const root = window.document.documentElement;
        
        // Remove the opposite class and add the current one
        const oldTheme = theme === 'dark' ? 'light' : 'dark';
        root.classList.remove(oldTheme);
        root.classList.add(theme);
        
        // Save the user's theme choice in localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Function to toggle the theme
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    // Provide the theme and the toggle function to all children
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};