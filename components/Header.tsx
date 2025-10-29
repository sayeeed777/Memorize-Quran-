import React from 'react';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
);


export const Header: React.FC<HeaderProps> = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <header className="py-4 px-6 md:px-8 flex justify-between items-center w-full max-w-4xl mx-auto border-b border-gray-200 dark:border-gray-800">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
        Quran Anki
      </h1>
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="p-2 rounded-full text-gray-500 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-white dark:focus:ring-offset-black"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  );
};