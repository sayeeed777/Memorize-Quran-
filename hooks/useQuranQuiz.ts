import { useState, useEffect, useMemo, useCallback } from 'react';
import { Surah, Ayah, Progress, ProgressStatus } from '../types';

export const useQuranQuiz = (
  surah: Surah | null, 
  initialProgress: Progress,
  onAyahRated: (ayahId: string, status: ProgressStatus) => void
) => {
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [reviewableAyahIds, setReviewableAyahIds] = useState<string[]>([]);
  const [currentAyah, setCurrentAyah] = useState<Ayah | null>(null);

  useEffect(() => {
    if (surah) {
      // When surah or initialProgress changes, re-initialize the session state.
      setProgress(initialProgress);
      
      const newReviewableAyahIds = surah.ayahs
        .filter(ayah => initialProgress[ayah.id] !== ProgressStatus.Mastered)
        .map(ayah => ayah.id);

      setReviewableAyahIds(newReviewableAyahIds);

      const firstAyahId = newReviewableAyahIds[0];
      const firstAyah = surah.ayahs.find(a => a.id === firstAyahId) || null;
      setCurrentAyah(firstAyah);
    } else {
      // Clear state if surah becomes null
      setProgress({});
      setReviewableAyahIds([]);
      setCurrentAyah(null);
    }
  }, [surah, initialProgress]);

  const getNextAyah = useCallback(() => {
    if (!surah) return null;
    // Get the next ayah from the *current* review queue
    const nextAyahId = reviewableAyahIds[1];
    return surah.ayahs.find(a => a.id === nextAyahId) || null;
  }, [surah, reviewableAyahIds]);

  const advanceToNextCard = useCallback(() => {
    setTimeout(() => {
      const nextAyah = getNextAyah();
      setCurrentAyah(nextAyah);
    }, 200);
  }, [getNextAyah]);

  const updateProgress = useCallback((ayahId: string, rating: 'again' | 'pass') => {
    const newStatus = rating === 'pass' ? ProgressStatus.Mastered : ProgressStatus.Learning;
    
    // Update local session progress
    setProgress(prev => ({ ...prev, [ayahId]: newStatus }));
    
    // Report the rating to the parent for persistent logging
    onAyahRated(ayahId, newStatus);
    
    if (rating === 'pass') {
        setReviewableAyahIds(prev => prev.filter(id => id !== ayahId));
    } else { // 'again'
        // Move to the back of the queue
        setReviewableAyahIds(prev => {
            const newQueue = prev.filter(id => id !== ayahId);
            newQueue.push(ayahId);
            return newQueue;
        });
    }
    advanceToNextCard();
  }, [advanceToNextCard, onAyahRated]);

  const progressStats = useMemo(() => {
    const total = surah?.ayahs.length ?? 0;
    if (total === 0) return { new: 0, learning: 0, mastered: 0 };

    // FIX: Provide a generic type argument to `reduce` to ensure the accumulator (`acc`) and the result (`counts`) are correctly typed. This resolves indexing and property access errors.
    // FIX: Explicitly type the `status` parameter in the reduce callback to resolve a type inference issue.
    const counts = Object.values(progress).reduce<Partial<Record<ProgressStatus, number>>>((acc, status: ProgressStatus) => {
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    const newCount = total - Object.keys(progress).length;

    return {
      new: (((counts.new || 0) + newCount) / total) * 100,
      learning: ((counts.learning || 0) / total) * 100,
      mastered: ((counts.mastered || 0) / total) * 100,
    };
  }, [progress, surah]);

  return {
    currentAyah,
    progress,
    progressStats,
    updateProgress,
    totalAyahs: surah?.ayahs.length ?? 0,
    masteredCount: Object.values(progress).filter(p => p === ProgressStatus.Mastered).length
  };
};