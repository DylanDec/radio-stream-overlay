import { useNowPlaying } from '@/hooks/useNowPlaying';
import { Equalizer } from './Equalizer';
import { ProgressBar } from './ProgressBar';
import { AnimatedBackground } from './AnimatedBackground';
import { Radio, SkipForward, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono tabular-nums">
      {time.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
}

export function RadioOverlay() {
  const { nowPlaying, nextTrack, showTheme } = useNowPlaying();
  const [trackKey, setTrackKey] = useState('');

  // Re-trigger entrance animation on track change
  useEffect(() => {
    setTrackKey(`${nowPlaying.artist}-${nowPlaying.title}`);
  }, [nowPlaying.artist, nowPlaying.title]);

  return (
    <div className="overlay-container bg-background">
      {/* Background image with overlay */}
      <div
        className="overlay-bg"
        style={{ backgroundImage: `url(${showTheme.bgImage})` }}
      />

      {/* Animated canvas background */}
      <AnimatedBackground themeId={showTheme.id} />

      {/* Ambient glow orbs */}
      <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col h-full p-12">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 animate-float-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-md border border-border/50">
              <Radio className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-widest">Live</span>
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            </div>
          </div>

          <div className="flex items-center gap-6 animate-float-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-md border border-border/50">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <LiveClock />
            </div>
            <div className="px-4 py-2 rounded-full bg-secondary/20 backdrop-blur-md border border-secondary/30">
              <span className="text-sm font-medium text-secondary">{showTheme.label}</span>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Main now playing section */}
        <div className="max-w-[900px]">
          <div key={trackKey} className="space-y-6">
            {/* Equalizer */}
            <div className="animate-float-up" style={{ animationDelay: '0s' }}>
              <Equalizer />
            </div>

            {/* Glow separator */}
            <div className="glow-line animate-float-up" style={{ animationDelay: '0.1s' }} />

            {/* Now playing label */}
            <div className="animate-float-up" style={{ animationDelay: '0.15s' }}>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">
                Nu speelt
              </span>
            </div>

            {/* Track info */}
            <div className="animate-float-up" style={{ animationDelay: '0.25s' }}>
              <h1
                className="text-6xl font-bold tracking-tight text-foreground text-glow leading-[1.05]"
                style={{ textWrap: 'balance' }}
              >
                {nowPlaying.title}
              </h1>
            </div>

            <div className="animate-float-up" style={{ animationDelay: '0.35s' }}>
              <p className="text-3xl font-medium text-primary/90 text-glow">
                {nowPlaying.artist}
              </p>
              {nowPlaying.album && (
                <p className="mt-1 text-lg text-muted-foreground">
                  {nowPlaying.album}
                </p>
              )}
            </div>

            {/* Progress */}
            <div className="animate-float-up max-w-[600px]" style={{ animationDelay: '0.45s' }}>
              <ProgressBar elapsed={nowPlaying.elapsed} duration={nowPlaying.duration} />
            </div>

            {/* Next track */}
            <div className="animate-float-up" style={{ animationDelay: '0.55s' }}>
              <div className="flex items-center gap-3 mt-4 px-4 py-3 rounded-xl bg-muted/30 backdrop-blur-sm border border-border/30 max-w-fit">
                <SkipForward className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                  Hierna
                </span>
                <span className="text-sm text-foreground/80">
                  {nextTrack.artist} — {nextTrack.title}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom station branding */}
        <div className="mt-12 flex items-center justify-between animate-float-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Radio className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">AutoDJ Radio</div>
              <div className="text-xs text-muted-foreground">24/7 Non-stop muziek</div>
            </div>
          </div>

          {/* Jingle trigger (click for demo) */}
          <button
            onClick={triggerJingle}
            className="px-3 py-1.5 rounded-md bg-accent/20 border border-accent/30 text-xs font-mono text-accent hover:bg-accent/30 transition-colors active:scale-95"
          >
            ▶ Jingle
          </button>
        </div>
      </div>

      {/* Jingle overlay */}
      <JingleOverlay active={isJingleActive} />
    </div>
  );
}
