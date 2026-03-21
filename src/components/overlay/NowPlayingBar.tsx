import { NowPlayingData, NextTrack } from '@/hooks/useNowPlaying';
import { Radio, SkipForward } from 'lucide-react';
import { Equalizer } from './Equalizer';
import { useEffect, useState } from 'react';

interface NowPlayingBarProps {
  nowPlaying: NowPlayingData;
  nextTrack: NextTrack;
}

function formatTime(seconds?: number) {
  if (!seconds || seconds <= 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono tabular-nums text-xs text-muted-foreground">
      {time.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
    </span>
  );
}

export function NowPlayingBar({ nowPlaying, nextTrack }: NowPlayingBarProps) {
  const progressPct = nowPlaying.duration
    ? ((nowPlaying.elapsed || 0) / nowPlaying.duration) * 100
    : 0;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30">
      {/* Progress line across full width */}
      <div className="h-[2px] w-full bg-foreground/5">
        <div
          className="h-full bg-primary"
          style={{ width: `${progressPct}%`, transition: 'width 1s linear' }}
        />
      </div>

      <div
        className="flex items-center gap-6 px-12 py-4"
        style={{
          background: `linear-gradient(to top, hsla(var(--background), 0.95), hsla(var(--background), 0.8))`,
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Live badge + branding */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Radio className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-medium text-primary uppercase tracking-widest">Live</span>
          </div>
        </div>

        {/* Equalizer */}
        <div className="shrink-0 w-12 h-5 overflow-hidden">
          <Equalizer />
        </div>

        {/* Track info */}
        <div className="flex items-baseline gap-3 min-w-0">
          <span className="text-lg font-bold text-foreground truncate">
            {nowPlaying.title}
          </span>
          <span className="text-base text-primary/80 truncate">
            {nowPlaying.artist}
          </span>
          {nowPlaying.album && (
            <span className="text-sm text-muted-foreground truncate hidden xl:inline">
              {nowPlaying.album}
            </span>
          )}
        </div>

        {/* Time */}
        <div className="ml-auto flex items-center gap-6 shrink-0">
          <span className="text-xs font-mono tabular-nums text-muted-foreground">
            {formatTime(nowPlaying.elapsed)} / {formatTime(nowPlaying.duration)}
          </span>

          {/* Divider */}
          <div className="w-px h-5 bg-border/50" />

          {/* Next up */}
          <div className="flex items-center gap-2">
            <SkipForward className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Hierna
            </span>
            <span className="text-xs text-foreground/70">
              {nextTrack.artist} — {nextTrack.title}
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-border/50" />

          <LiveClock />
        </div>
      </div>
    </div>
  );
}
