import { ScheduleEntry } from '@/hooks/useSchedule';
import { NowPlayingData, NextTrack } from '@/hooks/useNowPlaying';
import { Mic2, Clock, SkipForward, Disc3, Calendar } from 'lucide-react';

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
    const d = new Date(isoString);
    return d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function getTimeRemaining(endTimestamp: number) {
  const remaining = Math.max(0, endTimestamp - Date.now() / 1000);
  const mins = Math.floor(remaining / 60);
  const hrs = Math.floor(mins / 60);
  if (hrs > 0) return `${hrs}u ${mins % 60}m`;
  return `${mins}m`;
}

export function ShowPage({ show, nowPlaying, nextTrack, upcoming }: ShowPageProps) {
  const progressPct = nowPlaying.duration
    ? ((nowPlaying.elapsed || 0) / nowPlaying.duration) * 100
    : 0;

  return (
    <div className="absolute inset-0 z-10 flex flex-col px-4 sm:px-8 lg:px-16 pt-8 sm:pt-12 lg:pt-16 pb-20 sm:pb-24 overflow-y-auto">
      {/* Show header */}
      <div
        className="animate-float-up flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-12"
      >
        {/* Show icon */}
        <div
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            background: 'linear-gradient(135deg, hsla(var(--primary), 0.15), hsla(var(--secondary), 0.1))',
            border: '1px solid hsla(var(--primary), 0.2)',
            boxShadow: '0 8px 32px hsla(var(--primary), 0.08)',
          }}
        >
          <Mic2 className="w-7 h-7 sm:w-9 sm:h-9 text-primary" />
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          {/* Live badge */}
          <div className="flex items-center gap-2 mb-1">
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-full"
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
              className="flex items-center gap-1.5 px-3 py-1 rounded-full"
              style={{
                background: 'hsla(var(--foreground), 0.04)',
                border: '1px solid hsla(var(--foreground), 0.08)',
              }}
            >
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] sm:text-xs font-mono text-muted-foreground">
                nog {getTimeRemaining(show.endTimestamp)}
              </span>
            </div>
          </div>

          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05]"
            style={{ textWrap: 'balance', overflowWrap: 'break-word' }}
          >
            {show.name}
          </h1>

          {show.description && (
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground/70 mt-1 max-w-[600px]">
              {show.description}
            </p>
          )}

          <p className="text-xs sm:text-sm font-mono text-muted-foreground/50 mt-1">
            {formatScheduleTime(show.start)} — {formatScheduleTime(show.end)}
          </p>
        </div>
      </div>

      {/* Now playing section */}
      <div
        className="animate-float-up rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8"
        style={{
          animationDelay: '0.1s',
          background: 'hsla(var(--card), 0.5)',
          backdropFilter: 'blur(20px)',
          border: '1px solid hsla(var(--primary), 0.12)',
          boxShadow: '0 8px 40px hsla(var(--background), 0.4)',
        }}
      >
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-primary/60">
            Nu speelt
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-8">
          {/* Album art */}
          <div
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl shrink-0 flex items-center justify-center overflow-hidden"
            style={{
              background: nowPlaying.artUrl
                ? undefined
                : 'linear-gradient(135deg, hsla(var(--primary), 0.1), hsla(var(--secondary), 0.08))',
              border: '1px solid hsla(var(--primary), 0.12)',
              boxShadow: '0 8px 32px hsla(var(--background), 0.5)',
            }}
          >
            {nowPlaying.artUrl ? (
              <img src={nowPlaying.artUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <Disc3 className="w-10 h-10 sm:w-14 sm:h-14 text-primary/20 animate-[spin_8s_linear_infinite]" />
            )}
          </div>

          {/* Track info */}
          <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0 text-center sm:text-left flex-1">
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-[1.1]"
              style={{ overflowWrap: 'break-word' }}
            >
              {nowPlaying.title}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl font-medium text-primary/70">
              {nowPlaying.artist}
            </p>
            {nowPlaying.album && (
              <p className="text-sm text-muted-foreground/50 italic">{nowPlaying.album}</p>
            )}

            {/* Progress */}
            <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4 justify-center sm:justify-start">
              <div className="flex-1 max-w-[300px] sm:max-w-[350px]">
                <div
                  className="h-1 sm:h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'hsla(var(--foreground), 0.06)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${progressPct}%`,
                      background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))',
                      transition: 'width 1s linear',
                      boxShadow: '0 0 6px hsla(var(--primary), 0.25)',
                    }}
                  />
                </div>
              </div>
              <span className="text-xs font-mono tabular-nums text-muted-foreground">
                {formatTime(nowPlaying.elapsed)}
                <span className="text-muted-foreground/40 mx-1">/</span>
                {formatTime(nowPlaying.duration)}
              </span>
            </div>

            {/* Next up */}
            {nextTrack.title && (
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                <SkipForward className="w-3 h-3 text-muted-foreground/40" />
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground/40">
                  Hierna
                </span>
                <span className="text-xs text-foreground/40 truncate">
                  {nextTrack.artist} — {nextTrack.title}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming shows */}
      {upcoming.length > 0 && (
        <div
          className="animate-float-up"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground/40" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground/40">
              Straks op de radio
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcoming.slice(0, 3).map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl px-4 py-3 sm:px-5 sm:py-4"
                style={{
                  background: 'hsla(var(--card), 0.35)',
                  border: '1px solid hsla(var(--foreground), 0.06)',
                }}
              >
                <p className="text-xs font-mono text-muted-foreground/50 mb-1">
                  {formatScheduleTime(entry.start)} — {formatScheduleTime(entry.end)}
                </p>
                <p className="text-sm sm:text-base font-semibold text-foreground/80 truncate">
                  {entry.name}
                </p>
                {entry.description && (
                  <p className="text-xs text-muted-foreground/40 truncate mt-0.5">
                    {entry.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
