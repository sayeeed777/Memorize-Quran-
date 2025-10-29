// FIX: Removed self-import of 'SurahInfo' which was conflicting with the local declaration.
export interface SurahInfo {
  id: number;
  name: string;
  englishName: string;
  revelationType: string;
  numberOfAyahs: number;
}

export enum ProgressStatus {
  New = 'new',
  Learning = 'learning',
  Mastered = 'mastered',
}

export interface Ayah {
  id: string; // "surah:ayah"
  surah: number;
  ayah: number;
  numberInQuran: number;
  arabic: string;
  english: string;
  // FIX: Add optional englishName to support enriched Ayah objects used in the app.
  englishName?: string;
}

export interface Surah {
  id: number;
  name: string;
  englishName: string;
  revelationType: string;
  ayahs: Ayah[];
}

export type Progress = Record<string, ProgressStatus>;

// New types for progress tracking
export interface StudyLog {
  date: string; // YYYY-MM-DD
  masteredCount: number;
}

export interface StreakData {
  current: number;
  longest: number;
  lastStudyDate: string | null;
}

export interface ProgressData {
  surahProgress: Record<number, Progress>; // Keyed by surahId
  studyHistory: StudyLog[];
  streak: StreakData;
}