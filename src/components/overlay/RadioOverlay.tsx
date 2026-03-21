import { useNowPlaying } from '@/hooks/useNowPlaying';
import { AnimatedBackground } from './AnimatedBackground';
import { ShowSlideshow } from './ShowSlideshow';
import { NowPlayingBar } from './NowPlayingBar';

export function RadioOverlay() {
  const { nowPlaying, nextTrack, showTheme } = useNowPlaying();

  return (
    <div className="overlay-container">
      {/* Full animated canvas background */}
      <AnimatedBackground themeId={showTheme.id} />

      {/* Show slideshow */}
      <ShowSlideshow />

      {/* Compact now-playing bar at the bottom */}
      <NowPlayingBar nowPlaying={nowPlaying} nextTrack={nextTrack} />
    </div>
  );
}
