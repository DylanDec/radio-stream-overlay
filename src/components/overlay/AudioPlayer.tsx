import { useEffect, useRef, useState } from 'react';
import { CONFIG } from '@/config';

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Autoplay requires user interaction in most browsers
  // Listen for first click/key anywhere on page, then start playback
  useEffect(() => {
    function handleInteraction() {
      setHasInteracted(true);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    }
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (hasInteracted) {
      audio.play().catch(() => {
        // Browser blocked autoplay, will retry on next interaction
      });
    }
  }, [hasInteracted]);

  // Reconnect on error (stream drop)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    function handleError() {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.play().catch(() => {});
        }
      }, 5000);
    }

    audio.addEventListener('error', handleError);
    return () => audio.removeEventListener('error', handleError);
  }, []);

  return (
    <audio
      ref={audioRef}
      src={CONFIG.STREAM_URL}
      preload="none"
      className="hidden"
    />
  );
}
