import React, { useState, useMemo, useEffect } from 'react';
import { useQuranQuiz } from './hooks/useQuranQuiz';
import { useProgressTracker } from './hooks/useProgressTracker';
import { Header } from './components/Header';
import { SurahSelector } from './components/SurahSelector';
import { ProgressBar } from './components/ProgressBar';
import { QuranCard } from './components/QuranCard';
import { StatsDashboard } from './components/StatsDashboard';
import { Surah, Ayah, SurahInfo, ProgressStatus } from './types';

const LoadingSpinner = () => (
    <div className="w-full max-w-md min-h-[28rem] flex flex-col justify-center items-center p-8 bg-white dark:bg-gray-900 rounded-4xl shadow-lg border border-gray-200 dark:border-gray-800">
      <svg className="animate-spin h-10 w-10 text-gray-500 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-gray-500 dark:text-gray-400 mt-4">Loading Surah...</p>
    </div>
);

const translations = [
  { id: 'en.sahih', name: 'Sahih International' },
  { id: 'en.pickthall', name: 'Pickthall' },
  { id: 'en.yusufali', name: 'Yusuf Ali' },
  { id: 'en.arberry', name: 'Arberry' },
  { id: 'en.hilali', name: 'Hilali & Khan' },
];

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [surahsList, setSurahsList] = useState<SurahInfo[]>([]);
  const [selectedSurahId, setSelectedSurahId] = useState<number>(1);
  const [selectedTranslation, setSelectedTranslation] = useState<string>('en.sahih');
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [isLoadingSurahs, setIsLoadingSurahs] = useState(true);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    progressData,
    stats,
    getSurahProgress,
    logAyahStudied,
    resetSurahProgress,
  } = useProgressTracker();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const fetchSurahList = async () => {
      try {
        const response = await fetch('https://api.alquran.cloud/v1/meta');
        const data = await response.json();
        const surahReferences = data.data.surahs.references;
        const formattedSurahs: SurahInfo[] = surahReferences.map((s: any) => ({
          id: s.number,
          name: s.name,
          englishName: s.englishName,
          revelationType: s.revelationType,
          numberOfAyahs: s.numberOfAyahs
        }));
        setSurahsList(formattedSurahs);
      } catch (error) {
        console.error("Failed to fetch surah list:", error);
      } finally {
        setIsLoadingSurahs(false);
      }
    };
    fetchSurahList();
  }, []);

  const filteredSurahs = useMemo(() => {
    if (!surahsList) return [];
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      return surahsList;
    }
    
    // Check for "surah:ayah" format, e.g., "2:255" or "2:"
    const ayahRefMatch = query.match(/^(\d+):(\d*)$/);
    if (ayahRefMatch) {
      const surahNum = parseInt(ayahRefMatch[1], 10);
      return surahsList.filter(surah => surah.id === surahNum);
    }

    return surahsList.filter(surah =>
      surah.englishName.toLowerCase().includes(query) ||
      surah.name.includes(query) || // Arabic name
      String(surah.id).includes(query)
    );
  }, [surahsList, searchQuery]);

  useEffect(() => {
    // If the currently selected surah is not in the filtered list,
    // and the list is not empty, update selection to the first available surah.
    if (filteredSurahs.length > 0) {
        const isSelectedSurahInList = filteredSurahs.some(s => s.id === selectedSurahId);
        if (!isSelectedSurahInList) {
            setSelectedSurahId(filteredSurahs[0].id);
        }
    }
  }, [filteredSurahs, selectedSurahId]);

  useEffect(() => {
    if (!selectedSurahId) return;

    const fetchSurahData = async () => {
      setIsLoadingAyahs(true);
      setSelectedSurah(null);
      try {
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${selectedSurahId}/editions/quran-uthmani,${selectedTranslation}`);
        const data = await response.json();
        const arabicEdition = data.data[0];
        const englishEdition = data.data[1];

        const ayahs: Ayah[] = arabicEdition.ayahs.map((ayah: any, index: number) => ({
          id: `${arabicEdition.number}:${ayah.numberInSurah}`,
          surah: arabicEdition.number,
          ayah: ayah.numberInSurah,
          numberInQuran: ayah.number,
          arabic: ayah.text,
          english: englishEdition.ayahs[index].text,
          englishName: arabicEdition.englishName,
        }));
        
        const surahData: Surah = {
          id: arabicEdition.number,
          name: arabicEdition.name,
          englishName: arabicEdition.englishName,
          revelationType: arabicEdition.revelationType,
          ayahs: ayahs,
        };
        setSelectedSurah(surahData);

      } catch (error) {
        console.error(`Failed to fetch data for surah ${selectedSurahId}:`, error);
      } finally {
        setIsLoadingAyahs(false);
      }
    };

    fetchSurahData();
  }, [selectedSurahId, selectedTranslation]);

  const surahInitialProgress = useMemo(() => {
    return getSurahProgress(selectedSurahId);
  }, [selectedSurahId, getSurahProgress, progressData]);

  const handleAyahRated = (ayahId: string, status: ProgressStatus) => {
    if (selectedSurah) {
      logAyahStudied(selectedSurah, ayahId, status);
    }
  };

  const {
    currentAyah,
    progressStats,
    updateProgress,
    totalAyahs,
    masteredCount
  } = useQuranQuiz(selectedSurah, surahInitialProgress, handleAyahRated);

  const handleSelectSurah = (id: number) => {
    setSelectedSurahId(id);
  };

  const handleReset = () => {
    if (selectedSurah) {
      resetSurahProgress(selectedSurah);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      <div className="flex flex-col items-center p-4 space-y-6">
        <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <div className="w-full max-w-xl animate-fadeInUp">
            <SurahSelector
                surahs={filteredSurahs}
                selectedSurahId={selectedSurahId}
                onSelectSurah={handleSelectSurah}
                onReset={handleReset}
                onShowStats={() => setIsStatsModalOpen(true)}
                totalAyahs={totalAyahs}
                masteredCount={masteredCount}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                translations={translations}
                selectedTranslation={selectedTranslation}
                onSelectTranslation={setSelectedTranslation}
            />
        </div>
        <div className="w-full max-w-md animate-fadeInUp" style={{animationDelay: '100ms'}}>
            <ProgressBar stats={progressStats} />
        </div>
        <div className="animate-fadeInUp" style={{animationDelay: '200ms'}}>
        {isLoadingAyahs ? (
            <LoadingSpinner />
        ) : (
          <QuranCard
            key={currentAyah?.id || 'finished'}
            ayah={currentAyah}
            onRate={updateProgress}
          />
        )}
        </div>
      </div>
      <StatsDashboard 
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        stats={stats}
      />
    </div>
  );
}

export default App;