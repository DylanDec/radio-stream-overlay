interface ProgressBarProps {
  elapsed?: number;
  duration?: number;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export function ProgressBar({ elapsed = 0, duration = 0 }: ProgressBarProps) {
  const pct = duration > 0 ? Math.min((elapsed / duration) * 100, 100) : 0;

  return (
    <div className="space-y-1.5">
      <div className="relative h-1 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary/40 blur-sm"
          style={{ width: `${pct}%` }}
        />
      </div>
      {duration > 0 && (
        <div className="flex justify-between font-mono text-xs text-muted-foreground tabular-nums">
          <span>{formatTime(elapsed)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
}
