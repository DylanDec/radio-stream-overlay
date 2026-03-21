import { useEffect, useState } from 'react';

interface JingleOverlayProps {
  active: boolean;
}

export function JingleOverlay({ active }: JingleOverlayProps) {
  const [phase, setPhase] = useState<'in' | 'out' | 'hidden'>('hidden');

  useEffect(() => {
    if (active) {
      setPhase('in');
      const timer = setTimeout(() => setPhase('out'), 2000);
      const hide = setTimeout(() => setPhase('hidden'), 2500);
      return () => {
        clearTimeout(timer);
        clearTimeout(hide);
      };
    }
  }, [active]);

  if (phase === 'hidden') return null;

  return (
    <div className={`jingle-overlay ${phase === 'out' ? 'animate-jingle-out' : ''}`}>
      <div className={`text-center ${phase === 'in' ? 'animate-jingle-in' : ''}`}>
        <div className="text-7xl font-bold text-glow tracking-tight text-primary">
          🎵
        </div>
        <div className="mt-4 text-3xl font-semibold text-foreground text-glow">
          Jingle Time
        </div>
        <div className="mt-2 text-lg text-muted-foreground">
          Stay tuned...
        </div>
      </div>
    </div>
  );
}
