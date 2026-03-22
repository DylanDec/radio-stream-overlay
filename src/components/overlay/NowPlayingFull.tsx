import { NowPlayingData, NextTrack } from '@/hooks/useNowPlaying';
import { SkipForward, Disc3 } from 'lucide-react';

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
      className={`absolute inset-0 z-10 flex items-center justify-center px-6 sm:px-10 lg:px-16 transition-all duration-700 ease-out ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Subtle accent glow behind content */}
      <div
        className="absolute w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] lg:w-[600px] lg:h-[600px] rounded-full opacity-20 blur-[80px] lg:blur-[120px]"
        style={{ background: 'hsl(var(--primary))' }}
      />

      <div className="relative flex flex-col items-center gap-5 sm:gap-7 lg:gap-10 max-w-[1000px] w-full">
        {/* Live badge */}
        <div
          className={`flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full transition-all duration-500 delay-100 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{
            background: 'hsla(var(--primary), 0.08)',
            border: '1px solid hsla(var(--primary), 0.2)',
          }}
        >
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-primary">
            Nu speelt
          </span>
        </div>

        {/* Main content row */}
        <div
          className={`flex flex-col sm:flex-row items-center gap-6 sm:gap-8 lg:gap-14 transition-all duration-600 delay-200 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Album art */}
          <div className="relative shrink-0">
            <div
              className="w-32 h-32 sm:w-44 sm:h-44 lg:w-56 lg:h-56 rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden"
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
                <Disc3 className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-primary/20 animate-[spin_8s_linear_infinite]" />
              )}
            </div>
          </div>

          {/* Track info */}
          <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 min-w-0 text-center sm:text-left">
            <h1
              className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.0]"
              style={{ textWrap: 'balance', overflowWrap: 'break-word' }}
            >
              {nowPlaying.title}
            </h1>
            <p className="text-lg sm:text-2xl lg:text-3xl font-medium text-primary/70">
              {nowPlaying.artist}
            </p>
            {nowPlaying.album && (
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground/60 italic">
                {nowPlaying.album}
              </p>
            )}

            {/* Progress section */}
            <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4 lg:mt-6">
              <div className="flex-1 max-w-[250px] sm:max-w-[320px] lg:max-w-[400px]">
                <div
                  className="h-1 sm:h-1.5 rounded-full overflow-hidden"
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

              <span className="text-xs sm:text-sm font-mono tabular-nums text-muted-foreground">
                {formatTime(nowPlaying.elapsed)}
                <span className="text-muted-foreground/40 mx-1">/</span>
                {formatTime(nowPlaying.duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Next up */}
        <div
          className={`flex items-center gap-2 sm:gap-3 mt-1 sm:mt-2 transition-all duration-500 delay-300 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <SkipForward className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground/40" />
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground/40">
            Hierna
          </span>
          <span className="text-xs sm:text-sm text-foreground/40 truncate max-w-[200px] sm:max-w-none">
            {nextTrack.artist} — {nextTrack.title}
          </span>
        </div>
      </div>
    </div>
  );
}
