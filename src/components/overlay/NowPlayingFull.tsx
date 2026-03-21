import { NowPlayingData, NextTrack } from '@/hooks/useNowPlaying';
import { Radio, SkipForward, Music } from 'lucide-react';
import { Equalizer } from './Equalizer';

interface NowPlayingFullProps {
  nowPlaying: NowPlayingData;
  nextTrack: NextTrack;
  visible: boolean;
}

function formatTime(seconds?: number) {
  if (!seconds || seconds <= 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function NowPlayingFull({ nowPlaying, nextTrack, visible }: NowPlayingFullProps) {
  const progressPct = nowPlaying.duration
    ? ((nowPlaying.elapsed || 0) / nowPlaying.duration) * 100
    : 0;

  return (
    <div
      className={`absolute inset-0 z-10 flex items-center justify-center transition-all duration-700 ease-out ${
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02] pointer-events-none'
      }`}
    >
      <div className="flex flex-col items-center gap-8 max-w-[900px]">
        {/* Live badge */}
        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-500 delay-100 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{
            background: 'hsla(var(--muted), 0.3)',
            borderColor: 'hsla(var(--primary), 0.25)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-primary">
            Nu op antenne
          </span>
        </div>

        {/* Album art + info */}
        <div
          className={`flex items-center gap-12 transition-all duration-600 delay-200 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Art placeholder */}
          <div
            className="w-48 h-48 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden"
            style={{
              background: nowPlaying.artUrl
                ? `url(${nowPlaying.artUrl}) center/cover`
                : 'linear-gradient(135deg, hsla(var(--primary), 0.15), hsla(var(--secondary), 0.15))',
              border: '1px solid hsla(var(--primary), 0.2)',
              boxShadow: '0 8px 40px hsla(var(--background), 0.5), 0 0 60px hsla(var(--primary), 0.08)',
            }}
          >
            {!nowPlaying.artUrl && (
              <Music className="w-16 h-16 text-primary/30" />
            )}
          </div>

          {/* Track details */}
          <div className="flex flex-col gap-3 min-w-0">
            <h1
              className="text-6xl font-bold tracking-tight text-foreground leading-[1.05]"
              style={{ textWrap: 'balance' }}
            >
              {nowPlaying.title}
            </h1>
            <p className="text-3xl font-medium text-primary/80">
              {nowPlaying.artist}
            </p>
            {nowPlaying.album && (
              <p className="text-lg text-muted-foreground">
                {nowPlaying.album}
              </p>
            )}

            {/* Equalizer + progress */}
            <div className="flex items-center gap-4 mt-4">
              <div className="w-16 h-6 overflow-hidden">
                <Equalizer />
              </div>

              {/* Progress bar */}
              <div className="flex-1 max-w-[320px]">
                <div className="h-1 rounded-full overflow-hidden bg-foreground/10">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${progressPct}%`, transition: 'width 1s linear' }}
                  />
                </div>
              </div>

              <span className="text-xs font-mono tabular-nums text-muted-foreground">
                {formatTime(nowPlaying.elapsed)} / {formatTime(nowPlaying.duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Next up */}
        <div
          className={`flex items-center gap-3 mt-4 transition-all duration-500 delay-300 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <SkipForward className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Hierna
          </span>
          <span className="text-sm text-foreground/60">
            {nextTrack.artist} — {nextTrack.title}
          </span>
        </div>
      </div>
    </div>
  );
}
