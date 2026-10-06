import { useCallback } from 'react';

export const useSpeechSynthesis = () => {
  const speak = useCallback((utterance) => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      synth.speak(utterance);
    } else {
      console.warn('Speech synthesis is not supported in this browser.');
    }
  }, []);

  return { speak };
};

