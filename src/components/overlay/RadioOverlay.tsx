import { useState, useEffect } from 'react';
import { useNowPlaying } from '@/hooks/useNowPlaying';
import { AnimatedBackground } from './AnimatedBackground';
import { ShowSlideshow } from './ShowSlideshow';
import { NowPlayingFull } from './NowPlayingFull';
import { NowPlayingBar } from './NowPlayingBar';

// Cycle: now-playing full (20s) → slideshow (60s) → repeat
const NOW_PLAYING_DURATION = 20_000;
const SLIDESHOW_DURATION = 60_000;

export function RadioOverlay() {
  const { nowPlaying, nextTrack, showTheme } = useNowPlaying();
  const [mode, setMode] = useState<'nowplaying' | 'slideshow'>('nowplaying');

  useEffect(() => {
    const duration = mode === 'nowplaying' ? NOW_PLAYING_DURATION : SLIDESHOW_DURATION;
    const timer = setTimeout(() => {
      setMode((prev) => (prev === 'nowplaying' ? 'slideshow' : 'nowplaying'));
    }, duration);
    return () => clearTimeout(timer);
  }, [mode]);

  return (
    <div className="overlay-container">
      {/* Always-visible animated canvas background */}
      <AnimatedBackground themeId={showTheme.id} />

      {/* Full now-playing view (visible when not in slideshow) */}
      <NowPlayingFull
        nowPlaying={nowPlaying}
        nextTrack={nextTrack}
        visible={mode === 'nowplaying'}
      />

      {/* Show slideshow (visible when in slideshow mode) */}
      <ShowSlideshow visible={mode === 'slideshow'} />

      {/* Compact now-playing bar always at the bottom */}
      <NowPlayingBar nowPlaying={nowPlaying} nextTrack={nextTrack} />
    </div>
  );
}
