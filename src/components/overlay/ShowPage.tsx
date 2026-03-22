import { ScheduleEntry } from '@/hooks/useSchedule';
import { NowPlayingData, NextTrack } from '@/hooks/useNowPlaying';
import { Mic2, Clock, SkipForward, Disc3, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ShowPageProps {
  show: ScheduleEntry;
  nowPlaying: NowPlayingData;
  nextTrack: NextTrack;
  upcoming: ScheduleEntry[];
}

function formatTime(seconds?: number) {
  if (!seconds || seconds <= 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatScheduleTime(isoString: string) {
  try {
    return new Date(isoString).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function useTimeRemaining(endTimestamp: number) {
  const [remaining, setRemaining] = useState('');
  useEffect(() => {
    const update = () => {
      const secs = Math.max(0, endTimestamp - Date.now() / 1000);
      const mins = Math.floor(secs / 60);
      const hrs = Math.floor(mins / 60);
      setRemaining(hrs > 0 ? `${hrs}u ${mins % 60}m` : `${mins}m`);
    };
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, [endTimestamp]);
  return remaining;
}

export function ShowPage({ show, nowPlaying, nextTrack, upcoming }: ShowPageProps) {
  const timeLeft = useTimeRemaining(show.endTimestamp);
  const progressPct = nowPlaying.duration
    ? ((nowPlaying.elapsed || 0) / nowPlaying.duration) * 100
    : 0;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-8 lg:px-16 pb-20 sm:pb-24 overflow-y-auto">
      {/* Accent glow */}
      <div
        className="absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full opacity-15 blur-[100px] pointer-events-none"
        style={{ background: 'hsl(var(--secondary))' }}
      />

      <div className="relative flex flex-col items-center gap-6 sm:gap-8 max-w-[800px] w-full">
        {/* Badges */}
        <div
          className="animate-float-up flex items-center gap-2"
        >
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: 'hsla(var(--secondary), 0.1)',
              border: '1px solid hsla(var(--secondary), 0.2)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-secondary">
              Nu live
            </span>
          </div>

          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              background: 'hsla(var(--foreground), 0.04)',
              border: '1px solid hsla(var(--foreground), 0.08)',
            }}
          >
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] sm:text-xs font-mono text-muted-foreground">
              nog {timeLeft}
            </span>
          </div>
        </div>

        {/* Show icon + name */}
        <div className="animate-float-up flex flex-col items-center gap-3 text-center" style={{ animationDelay: '0.06s' }}>
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, hsla(var(--primary), 0.12), hsla(var(--secondary), 0.08))',
              border: '1px solid hsla(var(--primary), 0.15)',
              boxShadow: '0 8px 32px hsla(var(--primary), 0.06)',
            }}
          >
            <Mic2 className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
          </div>

          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05]"
            style={{ textWrap: 'balance', overflowWrap: 'break-word' }}
          >
            {show.name}
          </h1>

          {show.description && (
            <p className="text-sm sm:text-base text-muted-foreground/60 max-w-[500px]" style={{ textWrap: 'balance' }}>
              {show.description}
            </p>
          )}

          <p className="text-xs font-mono text-muted-foreground/40">
            {formatScheduleTime(show.start)} — {formatScheduleTime(show.end)}
          </p>
        </div>

        {/* Now playing card */}
        <div
          className="animate-float-up w-full rounded-2xl p-5 sm:p-6"
          style={{
            animationDelay: '0.12s',
            background: 'hsla(var(--card), 0.45)',
            backdropFilter: 'blur(20px)',
            border: '1px solid hsla(var(--primary), 0.1)',
            boxShadow: '0 8px 40px hsla(var(--background), 0.4)',
          }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {/* Art */}
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl shrink-0 flex items-center justify-center overflow-hidden"
              style={{
                background: nowPlaying.artUrl
                  ? undefined
                  : 'linear-gradient(135deg, hsla(var(--primary), 0.08), hsla(var(--secondary), 0.06))',
                border: '1px solid hsla(var(--primary), 0.1)',
                boxShadow: '0 4px 24px hsla(var(--background), 0.5)',
              }}
            >
              {nowPlaying.artUrl ? (
                <img src={nowPlaying.artUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <Disc3 className="w-10 h-10 text-primary/20 animate-[spin_8s_linear_infinite]" />
              )}
            </div>

            {/* Track info */}
            <div className="flex flex-col gap-1 min-w-0 text-center sm:text-left flex-1">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary/50 mb-0.5">
                Nu speelt
              </p>
              <h2
                className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground leading-[1.1]"
                style={{ overflowWrap: 'break-word' }}
              >
                {nowPlaying.title}
              </h2>
              <p className="text-base sm:text-lg font-medium text-primary/60">
                {nowPlaying.artist}
              </p>
              {nowPlaying.album && (
                <p className="text-xs text-muted-foreground/40 italic">{nowPlaying.album}</p>
              )}

              {/* Progress */}
              <div className="flex items-center gap-3 mt-2 justify-center sm:justify-start">
                <div className="flex-1 max-w-[260px] sm:max-w-[300px]">
                  <div
                    className="h-1 rounded-full overflow-hidden"
                    style={{ background: 'hsla(var(--foreground), 0.06)' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${progressPct}%`,
                        background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))',
                        transition: 'width 1s linear',
                        boxShadow: '0 0 6px hsla(var(--primary), 0.2)',
                      }}
                    />
                  </div>
                </div>
                <span className="text-[10px] font-mono tabular-nums text-muted-foreground/60">
                  {formatTime(nowPlaying.elapsed)}
                  <span className="text-muted-foreground/30 mx-0.5">/</span>
                  {formatTime(nowPlaying.duration)}
                </span>
              </div>

              {/* Next */}
              {nextTrack.title && (
                <div className="flex items-center gap-1.5 mt-1.5 justify-center sm:justify-start">
                  <SkipForward className="w-2.5 h-2.5 text-muted-foreground/30" />
                  <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground/30">
                    Hierna
                  </span>
                  <span className="text-[11px] text-foreground/30 truncate">
                    {nextTrack.artist} — {nextTrack.title}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div className="animate-float-up w-full" style={{ animationDelay: '0.18s' }}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Calendar className="w-3 h-3 text-muted-foreground/30" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground/30">
                Straks
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
              {upcoming.slice(0, 3).map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-xl px-4 py-3 text-center flex-1 max-w-[250px] mx-auto sm:mx-0"
                  style={{
                    background: 'hsla(var(--card), 0.3)',
                    border: '1px solid hsla(var(--foreground), 0.05)',
                  }}
                >
                  <p className="text-[10px] font-mono text-muted-foreground/40 mb-1">
                    {formatScheduleTime(entry.start)} — {formatScheduleTime(entry.end)}
                  </p>
                  <p className="text-sm font-semibold text-foreground/70 truncate">
                    {entry.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
