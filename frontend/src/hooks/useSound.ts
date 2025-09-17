import { useCallback, useRef } from 'react';

type SoundType = 'correct' | 'incorrect' | 'complete';

const soundFiles: Record<SoundType, string> = {
  correct: '/duolingo-correct.mp3',
  incorrect: '/duolingo-incorrect.mp3',
  complete: '/lesson_complete.mp3'
};

export function useSound() {
  const audioRefs = useRef<Record<SoundType, HTMLAudioElement | null>>({
    correct: null,
    incorrect: null,
    complete: null
  });

  const playSound = useCallback((type: SoundType) => {
    try {
      if (!audioRefs.current[type]) {
        audioRefs.current[type] = new Audio(soundFiles[type]);
      }
      
      const audio = audioRefs.current[type];
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(error => {
          console.warn(`Failed to play ${type} sound:`, error);
        });
      }
    } catch (error) {
      console.warn(`Error creating or playing ${type} sound:`, error);
    }
  }, []);

  return { playSound };
}