import React, { useState, useEffect, useRef } from 'react';
import { Ayah } from '../types';

interface QuranCardProps {
  ayah: Ayah | null;
  onRate: (ayahId: string, rating: 'again' | 'pass') => void;
}

const RatingButton = ({ className, text, onClick }: { className: string; text: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex-1 px-4 py-3.5 text-base font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${className}`}
  >
    {text}
  </button>
);

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
);

const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
);


export const QuranCard: React.FC<QuranCardProps> = ({ ayah, onRate }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // When a new ayah is displayed, stop the previous audio
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);

    if (ayah) {
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.numberInQuran}.mp3`;
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onerror = () => {
        console.error(`Failed to load audio for ${ayah.id} (global number ${ayah.numberInQuran})`);
        setIsPlaying(false);
      }
    }

    // Cleanup function to pause audio when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [ayah]);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(error => {
        console.error("Audio playback failed:", error);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };


  if (!ayah) {
    return (
      <div className="w-full max-w-md min-h-[28rem] flex flex-col justify-center items-center text-center p-8 bg-white dark:bg-gray-900 rounded-4xl shadow-lg border border-gray-200 dark:border-gray-800">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">All Ayahs Mastered!</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Select another surah or reset your progress to practice again.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md min-h-[28rem] p-8 bg-white dark:bg-gray-900 rounded-4xl shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{ayah.englishName} ({ayah.surah}:{ayah.ayah})</p>
        <button 
          onClick={toggleAudio} 
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-white dark:focus:ring-offset-gray-900" 
          aria-label={isPlaying ? "Pause recitation" : "Play recitation"}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center text-center my-4">
        <p dir="rtl" lang="ar" className="font-arabic text-3xl md:text-4xl leading-loose text-gray-900 dark:text-white mb-6">
          {ayah.arabic}
        </p>
        <p className="text-base text-gray-700 dark:text-white leading-relaxed">
          "{ayah.english}"
        </p>
      </div>
      
      <div className="w-full flex gap-4 justify-between">
        <RatingButton className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white focus:ring-gray-400 dark:focus:ring-gray-500" text="Again" onClick={() => onRate(ayah.id, 'again')} />
        <RatingButton className="bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-black focus:ring-gray-900 dark:focus:ring-white" text="Pass" onClick={() => onRate(ayah.id, 'pass')} />
      </div>
    </div>
  );
};