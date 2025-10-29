import React from 'react';

interface ProgressBarProps {
  stats: {
    new: number;
    learning: number;
    mastered: number;
  };
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ stats }) => {
  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden flex">
        <div
          className="bg-blue-500 dark:bg-progress-new h-2 transition-all duration-500"
          style={{ width: `${stats.new}%` }}
          title={`New: ${stats.new.toFixed(0)}%`}
        ></div>
        <div
          className="bg-yellow-400 dark:bg-progress-learning h-2 transition-all duration-500"
          style={{ width: `${stats.learning}%` }}
          title={`Learning: ${stats.learning.toFixed(0)}%`}
        ></div>
        <div
          className="bg-green-400 dark:bg-progress-mastered h-2 transition-all duration-500"
          style={{ width: `${stats.mastered}%` }}
          title={`Mastered: ${stats.mastered.toFixed(0)}%`}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
        {/* Light mode legend */}
        <div className="flex items-center dark:hidden"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>New</div>
        <div className="flex items-center dark:hidden"><span className="w-2 h-2 rounded-full bg-yellow-400 mr-1.5"></span>Learning</div>
        <div className="flex items-center dark:hidden"><span className="w-2 h-2 rounded-full bg-green-400 mr-1.5"></span>Mastered</div>
        {/* Dark mode legend */}
        <div className="hidden items-center dark:flex"><span className="w-2 h-2 rounded-full bg-progress-new mr-1.5"></span>New</div>
        <div className="hidden items-center dark:flex"><span className="w-2 h-2 rounded-full bg-progress-learning mr-1.5"></span>Learning</div>
        <div className="hidden items-center dark:flex"><span className="w-2 h-2 rounded-full bg-progress-mastered mr-1.5"></span>Mastered</div>
      </div>
    </div>
  );
};