import { useState, useEffect, useMemo } from 'react';
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

  const isCalm = useMemo(() => {
    if (!currentShow) return false;
    return CONFIG.CALM_SHOWS.some(
      (name) => currentShow.name.toLowerCase() === name.toLowerCase()
    );
  }, [currentShow]);

  const isFestive = useMemo(() => {
    if (!currentShow) return false;
    return CONFIG.FESTIVE_SHOWS.some(
      (name) => currentShow.name.toLowerCase() === name.toLowerCase()
    );
  }, [currentShow]);

  // When a show is active, switch to show mode
  useEffect(() => {
    if (CONFIG.SHOW_PAGE_ENABLED && currentShow) {
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
      <AnimatedBackground themeId={showTheme.id} calm={isCalm} />

      {/* Calm mode dim overlay */}
      <div
        className={`absolute inset-0 z-[1] pointer-events-none transition-opacity duration-[2000ms] ${
          isCalm ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ background: 'hsla(240, 15%, 4%, 0.35)' }}
      />

      {mode === 'show' && currentShow ? (
        <ShowPage
          show={currentShow}
          nowPlaying={nowPlaying}
          nextTrack={nextTrack}
          upcoming={upcoming}
          calm={isCalm}
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

      <NowPlayingBar nowPlaying={nowPlaying} nextTrack={nextTrack} calm={isCalm} />
      <AudioPlayer />
    </div>
  );
}
