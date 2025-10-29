import React from 'react';
import { SurahInfo } from '../types';

interface SurahSelectorProps {
  surahs: SurahInfo[];
  selectedSurahId: number;
  onSelectSurah: (id: number) => void;
  onReset: () => void;
  onShowStats: () => void;
  totalAyahs: number;
  masteredCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  translations: { id: string; name: string }[];
  selectedTranslation: string;
  onSelectTranslation: (id: string) => void;
}

export const SurahSelector: React.FC<SurahSelectorProps> = ({ 
  surahs, 
  selectedSurahId, 
  onSelectSurah, 
  onReset, 
  onShowStats, 
  totalAyahs, 
  masteredCount,
  searchQuery,
  onSearchChange,
  translations,
  selectedTranslation,
  onSelectTranslation,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto p-6 flex flex-col gap-6 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800">
      <div>
        <label htmlFor="surah-search" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          Find Surah or Ayah
        </label>
        <input
          type="text"
          id="surah-search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="e.g., Al-Fatihah, الفاتحة, 1, or 2:255"
          className="block w-full pl-4 pr-4 py-3 text-base bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white focus:border-transparent rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-grow w-full flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-2/3">
              <label htmlFor="surah-select" className="sr-only sm:not-sr-only block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Select Surah
              </label>
              <select
                id="surah-select"
                value={selectedSurahId}
                onChange={(e) => onSelectSurah(Number(e.target.value))}
                className="block w-full pl-4 pr-10 py-3 text-base bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white focus:border-transparent rounded-xl text-gray-900 dark:text-white"
              >
                {surahs.map((surah) => (
                  <option key={surah.id} value={surah.id}>
                    {surah.id}. {surah.englishName} ({surah.name})
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-1/3">
              <label htmlFor="translation-select" className="sr-only sm:not-sr-only block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Translation
              </label>
              <select
                id="translation-select"
                value={selectedTranslation}
                onChange={(e) => onSelectTranslation(e.target.value)}
                className="block w-full pl-4 pr-10 py-3 text-base bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white focus:border-transparent rounded-xl text-gray-900 dark:text-white"
              >
                {translations.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">Mastered</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">{masteredCount} / {totalAyahs}</div>
        </div>
         <div className="flex gap-2">
          <button 
            onClick={onShowStats}
            className="px-5 py-2.5 text-sm font-semibold text-white dark:text-black bg-blue-500 dark:bg-white rounded-full hover:bg-blue-600 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-white dark:focus:ring-offset-gray-900 transition-colors duration-200"
          >
            Stats
          </button>
          <button 
            onClick={onReset}
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-white bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-slate-400 dark:focus:ring-offset-gray-900 transition-colors duration-200"
          >
            Reset
          </button>
         </div>
      </div>
    </div>
  );
};