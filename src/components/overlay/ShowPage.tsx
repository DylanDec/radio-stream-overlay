import { ScheduleEntry } from '@/hooks/useSchedule';
import { NowPlayingData, NextTrack } from '@/hooks/useNowPlaying';
import { Mic2, Clock, SkipForward, Disc3, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ShowPageProps {
  show: ScheduleEntry;
  nowPlaying: NowPlayingData;
  nextTrack: NextTrack;
  upcoming: ScheduleEntry[];
  calm?: boolean;
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

export function ShowPage({ show, nowPlaying, nextTrack, upcoming, calm = false }: ShowPageProps) {
  const timeLeft = useTimeRemaining(show.endTimestamp);
  const progressPct = nowPlaying.duration
    ? ((nowPlaying.elapsed || 0) / nowPlaying.duration) * 100
    : 0;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-8 lg:px-16 pb-20 sm:pb-24">
      {/* Soft accent glow */}
      <div
        className={`absolute w-[400px] h-[400px] sm:w-[550px] sm:h-[550px] rounded-full blur-[120px] pointer-events-none transition-opacity duration-[2000ms] ${
          calm ? 'opacity-[0.03]' : 'opacity-[0.08]'
        }`}
        style={{ background: calm ? 'hsl(220, 20%, 25%)' : 'hsl(var(--secondary))' }}
      />

      <div className="relative flex flex-col items-center w-full max-w-[720px]">

        {/* ── Show identity ── */}
        <div className="animate-float-up flex flex-col items-center text-center mb-10 sm:mb-14">
          {/* Badges row */}
          <div className="flex items-center gap-2 mb-5">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: 'hsla(var(--secondary), 0.08)',
                border: '1px solid hsla(var(--secondary), 0.15)',
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
                background: 'hsla(var(--foreground), 0.03)',
                border: '1px solid hsla(var(--foreground), 0.06)',
              }}
            >
              <Clock className="w-3 h-3 text-muted-foreground/50" />
              <span className="text-[10px] sm:text-xs font-mono text-muted-foreground/50">
                nog {timeLeft}
              </span>
            </div>
          </div>

          {/* Icon */}
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4"
            style={{
              background: 'hsla(var(--primary), 0.08)',
              border: '1px solid hsla(var(--primary), 0.12)',
            }}
          >
            <Mic2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary/70" />
          </div>

          {/* Title */}
          <h1
            className="text-3xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-foreground leading-[1.05] mb-2"
            style={{ textWrap: 'balance', overflowWrap: 'break-word' }}
          >
            {show.name}
          </h1>

          {show.description && (
            <p
              className="text-sm sm:text-base text-muted-foreground/50 max-w-[460px] mb-1"
              style={{ textWrap: 'balance' }}
            >
              {show.description}
            </p>
          )}

          <p className="text-[11px] font-mono text-muted-foreground/30 tracking-wide">
            {formatScheduleTime(show.start)} — {formatScheduleTime(show.end)}
          </p>
        </div>

        {/* ── Now playing ── */}
        <div
          className="animate-float-up w-full rounded-2xl overflow-hidden mb-8 sm:mb-10"
          style={{ animationDelay: '0.1s' }}
        >
          {/* Top glow line */}
          <div className="glow-line" style={calm ? { opacity: 0.3 } : undefined} />

          <div
            className="p-5 sm:p-6"
            style={{
              background: 'hsla(var(--card), 0.4)',
              backdropFilter: 'blur(24px)',
              borderLeft: '1px solid hsla(var(--primary), 0.08)',
              borderRight: '1px solid hsla(var(--primary), 0.08)',
              borderBottom: '1px solid hsla(var(--primary), 0.08)',
              borderRadius: '0 0 1rem 1rem',
            }}
          >
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Art */}
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg shrink-0 flex items-center justify-center overflow-hidden"
                style={{
                  background: nowPlaying.artUrl
                    ? undefined
                    : 'linear-gradient(135deg, hsla(var(--primary), 0.06), hsla(var(--secondary), 0.04))',
                  border: '1px solid hsla(var(--foreground), 0.06)',
                }}
              >
                {nowPlaying.artUrl ? (
                  <img src={nowPlaying.artUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Disc3 className="w-8 h-8 sm:w-10 sm:h-10 text-primary/15 animate-[spin_8s_linear_infinite]" />
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-primary/40">
                  Nu speelt
                </p>
                <h2
                  className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-foreground leading-[1.15] truncate"
                  style={{ overflowWrap: 'break-word' }}
                >
                  {nowPlaying.title}
                </h2>
                <p className="text-sm sm:text-base font-medium text-primary/55 truncate">
                  {nowPlaying.artist}
                </p>

                {/* Progress bar */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1">
                    <div
                      className="h-[3px] rounded-full overflow-hidden"
                      style={{ background: 'hsla(var(--foreground), 0.05)' }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${progressPct}%`,
                          background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))',
                          transition: 'width 0.3s linear',
                          boxShadow: '0 0 4px hsla(var(--primary), 0.15)',
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono tabular-nums text-muted-foreground/50 shrink-0">
                    {formatTime(nowPlaying.elapsed)}
                    <span className="text-muted-foreground/25 mx-0.5">/</span>
                    {formatTime(nowPlaying.duration)}
                  </span>
                </div>

                {/* Next */}
                {nextTrack.title && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <SkipForward className="w-2.5 h-2.5 text-muted-foreground/25" />
                    <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-muted-foreground/25">
                      Hierna
                    </span>
                    <span className="text-[11px] text-foreground/25 truncate">
                      {nextTrack.artist} — {nextTrack.title}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Upcoming ── */}
        {upcoming.length > 0 && (
          <div className="animate-float-up w-full" style={{ animationDelay: '0.18s' }}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Calendar className="w-3 h-3 text-muted-foreground/25" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground/25">
                Straks
              </span>
            </div>

            <div className="flex gap-2 sm:gap-3 justify-center">
              {upcoming.slice(0, 3).map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-center flex-1 max-w-[200px]"
                  style={{
                    background: 'hsla(var(--card), 0.25)',
                    border: '1px solid hsla(var(--foreground), 0.04)',
                  }}
                >
                  <p className="text-[10px] font-mono text-muted-foreground/35 mb-0.5">
                    {formatScheduleTime(entry.start)}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-foreground/60 truncate">
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
