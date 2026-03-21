import { NowPlayingData, NextTrack } from '@/hooks/useNowPlaying';
import { SkipForward, Music, Disc3 } from 'lucide-react';
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
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Subtle accent glow behind content */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
        style={{ background: 'hsl(var(--primary))' }}
      />

      <div className="relative flex flex-col items-center gap-10 max-w-[1000px]">
        {/* Live badge */}
        <div
          className={`flex items-center gap-2.5 px-5 py-2 rounded-full transition-all duration-500 delay-100 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{
            background: 'hsla(var(--primary), 0.08)',
            border: '1px solid hsla(var(--primary), 0.2)',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-primary">
            Nu speelt
          </span>
        </div>

        {/* Main content row */}
        <div
          className={`flex items-center gap-14 transition-all duration-600 delay-200 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Album art */}
          <div className="relative shrink-0">
            <div
              className="w-56 h-56 rounded-2xl flex items-center justify-center overflow-hidden"
              style={{
                background: nowPlaying.artUrl
                  ? undefined
                  : 'linear-gradient(135deg, hsla(var(--primary), 0.12), hsla(var(--secondary), 0.1))',
                border: '1px solid hsla(var(--primary), 0.15)',
                boxShadow: '0 16px 64px hsla(var(--background), 0.6), 0 0 80px hsla(var(--primary), 0.06)',
              }}
            >
              {nowPlaying.artUrl ? (
                <img src={nowPlaying.artUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <Disc3 className="w-20 h-20 text-primary/20 animate-[spin_8s_linear_infinite]" />
              )}
            </div>
          </div>

          {/* Track info */}
          <div className="flex flex-col gap-4 min-w-0">
            <h1
              className="text-7xl font-bold tracking-tight text-foreground leading-[1.0]"
              style={{ textWrap: 'balance' }}
            >
              {nowPlaying.title}
            </h1>
            <p className="text-3xl font-medium text-primary/70">
              {nowPlaying.artist}
            </p>
            {nowPlaying.album && (
              <p className="text-lg text-muted-foreground/60 italic">
                {nowPlaying.album}
              </p>
            )}

            {/* Progress section */}
            <div className="flex items-center gap-5 mt-6">
              <div className="w-16 h-7 overflow-hidden opacity-70">
                <Equalizer />
              </div>

              <div className="flex-1 max-w-[360px]">
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'hsla(var(--foreground), 0.08)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${progressPct}%`,
                      background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))',
                      transition: 'width 1s linear',
                      boxShadow: '0 0 8px hsla(var(--primary), 0.3)',
                    }}
                  />
                </div>
              </div>

              <span className="text-sm font-mono tabular-nums text-muted-foreground">
                {formatTime(nowPlaying.elapsed)}
                <span className="text-muted-foreground/40 mx-1">/</span>
                {formatTime(nowPlaying.duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Next up */}
        <div
          className={`flex items-center gap-3 mt-2 transition-all duration-500 delay-300 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <SkipForward className="w-3.5 h-3.5 text-muted-foreground/40" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground/40">
            Hierna
          </span>
          <span className="text-sm text-foreground/40">
            {nextTrack.artist} — {nextTrack.title}
          </span>
        </div>
      </div>
    </div>
  );
}
