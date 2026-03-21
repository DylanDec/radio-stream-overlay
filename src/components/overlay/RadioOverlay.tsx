import { useState, useEffect } from 'react';
import { useNowPlaying } from '@/hooks/useNowPlaying';
import { AnimatedBackground } from './AnimatedBackground';
import { ShowSlideshow } from './ShowSlideshow';
import { NowPlayingFull } from './NowPlayingFull';
import { NowPlayingBar } from './NowPlayingBar';
import { AudioPlayer } from './AudioPlayer';
import { CONFIG } from '@/config';

export function RadioOverlay() {
  const { nowPlaying, nextTrack, showTheme } = useNowPlaying();
  const [mode, setMode] = useState<'nowplaying' | 'slideshow'>('nowplaying');

  useEffect(() => {
    const duration = mode === 'nowplaying' ? CONFIG.NOW_PLAYING_DURATION : CONFIG.SLIDESHOW_DURATION;
    const timer = setTimeout(() => {
      setMode((prev) => (prev === 'nowplaying' ? 'slideshow' : 'nowplaying'));
    }, duration);
    return () => clearTimeout(timer);
  }, [mode]);

  return (
    <div className="overlay-container">
      <AnimatedBackground themeId={showTheme.id} />
      <NowPlayingFull
        nowPlaying={nowPlaying}
        nextTrack={nextTrack}
        visible={mode === 'nowplaying'}
      />
      <ShowSlideshow visible={mode === 'slideshow'} />
      <NowPlayingBar nowPlaying={nowPlaying} nextTrack={nextTrack} />
      <AudioPlayer />
    </div>
  );
}
