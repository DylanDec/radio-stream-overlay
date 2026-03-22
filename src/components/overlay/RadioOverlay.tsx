import { useState, useEffect } from 'react';
import { useNowPlaying } from '@/hooks/useNowPlaying';
import { useSchedule } from '@/hooks/useSchedule';
import { AnimatedBackground } from './AnimatedBackground';
import { ShowSlideshow } from './ShowSlideshow';
import { NowPlayingFull } from './NowPlayingFull';
import { NowPlayingBar } from './NowPlayingBar';
import { ShowPage } from './ShowPage';
import { AudioPlayer } from './AudioPlayer';
import { CONFIG } from '@/config';

export function RadioOverlay() {
  const { nowPlaying, nextTrack, showTheme } = useNowPlaying();
  const { schedule, currentShow } = useSchedule();
  const [mode, setMode] = useState<'nowplaying' | 'slideshow' | 'show'>('nowplaying');

  // When a show is active, switch to show mode
  useEffect(() => {
    if (currentShow) {
      setMode('show');
    } else if (mode === 'show') {
      setMode('nowplaying');
    }
  }, [currentShow]);

  // Timer for nowplaying/slideshow rotation (only when no show active)
  useEffect(() => {
    if (currentShow) return;
    if (!CONFIG.SLIDESHOW_ENABLED) {
      setMode('nowplaying');
      return;
    }
    const duration = mode === 'nowplaying' ? CONFIG.NOW_PLAYING_DURATION : CONFIG.SLIDESHOW_DURATION;
    const timer = setTimeout(() => {
      setMode((prev) => (prev === 'nowplaying' ? 'slideshow' : 'nowplaying'));
    }, duration);
    return () => clearTimeout(timer);
  }, [mode, currentShow]);

  const upcoming = schedule.filter((e) => !e.isNow && e.startTimestamp > Date.now() / 1000);

  return (
    <div className="overlay-container">
      <AnimatedBackground themeId={showTheme.id} />

      {mode === 'show' && currentShow ? (
        <ShowPage
          show={currentShow}
          nowPlaying={nowPlaying}
          nextTrack={nextTrack}
          upcoming={upcoming}
        />
      ) : (
        <>
          <NowPlayingFull
            nowPlaying={nowPlaying}
            nextTrack={nextTrack}
            visible={mode === 'nowplaying'}
          />
          <ShowSlideshow visible={mode === 'slideshow'} />
        </>
      )}

      <NowPlayingBar nowPlaying={nowPlaying} nextTrack={nextTrack} />
      <AudioPlayer />
    </div>
  );
}
