import React from 'react';
import { BarChart } from './BarChart';

interface Stats {
  streak: {
    current: number;
    longest: number;
  };
  todayCount: number;
  weekCount: number;
  chartData: { label: string; value: number }[];
}

interface StatsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  stats: Stats;
}

const StatCard = ({ label, value, icon }: { label: string; value: string | number; icon: string }) => (
  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl text-center">
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
    <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
  </div>
);

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-xl flex justify-center items-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 h-9 w-9 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Close statistics"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Your Progress
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Current Streak" value={`${stats.streak.current} days`} icon="🔥" />
          <StatCard label="Longest Streak" value={`${stats.streak.longest} days`} icon="🏆" />
          <StatCard label="Mastered Today" value={stats.todayCount} icon="🎯" />
          <StatCard label="Mastered This Week" value={stats.weekCount} icon="🗓️" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Last 7 Days Activity
          </h3>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl">
            <BarChart data={stats.chartData} />
          </div>
        </div>
      </div>
    </div>
  );
};