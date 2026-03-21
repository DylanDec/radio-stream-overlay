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
    <span className="font-mono tabular-nums text-sm text-foreground/60">
      {time.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
}

export function NowPlayingBar({ nowPlaying, nextTrack }: NowPlayingBarProps) {
  const progressPct = nowPlaying.duration
    ? ((nowPlaying.elapsed || 0) / nowPlaying.duration) * 100
    : 0;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30">
      {/* Glow progress line */}
      <div className="relative h-[3px] w-full" style={{ background: 'hsla(var(--foreground), 0.05)' }}>
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: `${progressPct}%`,
            background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))',
            transition: 'width 1s linear',
            boxShadow: '0 0 12px hsla(var(--primary), 0.4), 0 0 4px hsla(var(--primary), 0.6)',
          }}
        />
      </div>

      <div
        className="flex items-center gap-8 px-12 py-5"
        style={{
          background: `linear-gradient(to top, hsla(var(--background), 0.97), hsla(var(--background), 0.85))`,
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Live badge + equalizer */}
        <div className="flex items-center gap-4 shrink-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'hsla(var(--primary), 0.12)',
              border: '1px solid hsla(var(--primary), 0.2)',
            }}
          >
            <Radio className="w-5 h-5 text-primary" />
          </div>

          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: 'hsla(var(--primary), 0.08)',
              border: '1px solid hsla(var(--primary), 0.15)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-mono font-medium text-primary uppercase tracking-[0.2em]">
              Live
            </span>
          </div>
        </div>

        {/* Equalizer */}
        <div className="shrink-0 w-14 h-6 overflow-hidden opacity-80">
          <Equalizer />
        </div>

        {/* Track info */}
        <div className="flex items-baseline gap-4 min-w-0 flex-1">
          <span className="text-xl font-bold text-foreground truncate">
            {nowPlaying.title}
          </span>
          <span className="text-lg text-primary/70 truncate">
            {nowPlaying.artist}
          </span>
          {nowPlaying.album && (
            <span className="text-sm text-muted-foreground/60 truncate">
              {nowPlaying.album}
            </span>
          )}
        </div>

        {/* Time elapsed */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono tabular-nums text-muted-foreground">
            {formatTime(nowPlaying.elapsed)}
          </span>
          <span className="text-xs text-muted-foreground/40">/</span>
          <span className="text-xs font-mono tabular-nums text-muted-foreground/60">
            {formatTime(nowPlaying.duration)}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-6 shrink-0" style={{ background: 'hsla(var(--border), 0.3)' }} />

        {/* Next up */}
        <div className="flex items-center gap-2 shrink-0">
          <SkipForward className="w-3.5 h-3.5 text-muted-foreground/50" />
          <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground/50">
            Hierna
          </span>
          <span className="text-xs text-foreground/50">
            {nextTrack.artist} — {nextTrack.title}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-6 shrink-0" style={{ background: 'hsla(var(--border), 0.3)' }} />

        {/* Clock */}
        <LiveClock />
      </div>
    </div>
  );
}
