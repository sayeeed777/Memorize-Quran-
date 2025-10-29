import { useState, useEffect, useCallback, useMemo } from 'react';
import { ProgressData, Progress, ProgressStatus, Surah, StudyLog } from '../types';

const STORAGE_KEY = 'quranAnkiProgress';

const getTodayDateString = () => new Date().toISOString().slice(0, 10);

const isYesterday = (date1Str: string, date2Str: string) => {
  const d1 = new Date(date1Str);
  const d2 = new Date(date2Str);
  d2.setDate(d2.getDate() - 1);
  return d1.toISOString().slice(0, 10) === d2.toISOString().slice(0, 10);
};

const defaultProgressData: ProgressData = {
  surahProgress: {},
  studyHistory: [],
  streak: {
    current: 0,
    longest: 0,
    lastStudyDate: null,
  },
};

export const useProgressTracker = () => {
  const [progressData, setProgressData] = useState<ProgressData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultProgressData;
    } catch (error) {
      console.error('Failed to load progress from localStorage', error);
      return defaultProgressData;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
    } catch (error) {
      console.error('Failed to save progress to localStorage', error);
    }
  }, [progressData]);

  const getSurahProgress = useCallback((surahId: number): Progress => {
    return progressData.surahProgress[surahId] || {};
  }, [progressData.surahProgress]);

  const logAyahStudied = useCallback((surah: Surah, ayahId: string, status: ProgressStatus) => {
    setProgressData(prevData => {
      const today = getTodayDateString();
      const newData = { ...prevData };

      // 1. Update Surah Progress
      const surahId = surah.id;
      const currentSurahProgress = { ...(newData.surahProgress[surahId] || {}) };
      currentSurahProgress[ayahId] = status;
      newData.surahProgress = { ...newData.surahProgress, [surahId]: currentSurahProgress };

      // 2. Update Study History & Streak (only if an ayah was mastered)
      if (status === ProgressStatus.Mastered) {
        const history = [...newData.studyHistory];
        let todayLog = history.find(log => log.date === today);
        if (todayLog) {
          todayLog.masteredCount++;
        } else {
          history.push({ date: today, masteredCount: 1 });
        }
        newData.studyHistory = history;

        // 3. Update Streak
        const streak = { ...newData.streak };
        if (streak.lastStudyDate !== today) {
          if (streak.lastStudyDate && isYesterday(streak.lastStudyDate, today)) {
            streak.current++;
          } else {
            streak.current = 1;
          }
          streak.lastStudyDate = today;
          if (streak.current > streak.longest) {
            streak.longest = streak.current;
          }
          newData.streak = streak;
        }
      }
      
      return newData;
    });
  }, []);

  const resetSurahProgress = useCallback((surah: Surah) => {
    setProgressData(prevData => {
      const newSurahProgress = { ...prevData.surahProgress };
      const newProgress: Progress = {};
      surah.ayahs.forEach(ayah => {
        newProgress[ayah.id] = ProgressStatus.New;
      });
      newSurahProgress[surah.id] = newProgress;
      return { ...prevData, surahProgress: newSurahProgress };
    });
  }, []);

  const stats = useMemo(() => {
    const today = getTodayDateString();
    const todayLog = progressData.studyHistory.find(log => log.date === today);
    const todayCount = todayLog?.masteredCount || 0;

    const last7Days: StudyLog[] = [];
    const dateSet = new Set<string>();

    for(let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);
        dateSet.add(dateStr);
        const log = progressData.studyHistory.find(l => l.date === dateStr);
        last7Days.push(log || { date: dateStr, masteredCount: 0 });
    }

    const weekCount = last7Days.reduce((sum, log) => sum + log.masteredCount, 0);

    const chartData = last7Days.reverse().map(log => ({
      label: new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' }),
      value: log.masteredCount,
    }));
    
    return {
      streak: progressData.streak,
      todayCount,
      weekCount,
      chartData,
    };

  }, [progressData.studyHistory, progressData.streak]);

  return { progressData, stats, getSurahProgress, logAyahStudied, resetSurahProgress };
};
