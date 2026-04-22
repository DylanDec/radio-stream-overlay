import { Cast, Loader2 } from 'lucide-react';
import { useCast } from '@/hooks/useCast';
import type { NowPlayingData } from '@/hooks/useNowPlaying';

interface CastButtonProps {
  nowPlaying: NowPlayingData;
}

export function CastButton({ nowPlaying }: CastButtonProps) {
  const { status, deviceName, startCasting, stopCasting } = useCast();

  if (status === 'unsupported') return null;

  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';

  const handleClick = () => {
    if (isConnected) {
      stopCasting();
    } else {
      startCasting({
        title: nowPlaying.title,
        subtitle: nowPlaying.artist,
        artwork: nowPlaying.artUrl,
      });
    }
  };

  const Icon = isConnecting ? Loader2 : Cast;

  return (
    <button
      onClick={handleClick}
      disabled={isConnecting}
      title={
        isConnected
          ? `Casting naar ${deviceName ?? 'apparaat'} — klik om te stoppen`
          : status === 'unavailable'
          ? 'Geen Cast-apparaten gevonden'
          : 'Cast naar Google apparaat'
      }
      className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-wait shrink-0"
      style={{
        background: isConnected
          ? 'hsla(var(--primary), 0.18)'
          : 'hsla(var(--foreground), 0.05)',
        border: `1px solid ${
          isConnected ? 'hsla(var(--primary), 0.4)' : 'hsla(var(--border), 0.3)'
        }`,
      }}
    >
      <Icon
        className={`w-3.5 h-3.5 ${isConnected ? 'text-primary' : 'text-foreground/60'} ${
          isConnecting ? 'animate-spin' : ''
        }`}
      />
      <span
        className={`hidden sm:inline text-[10px] font-mono uppercase tracking-[0.15em] ${
          isConnected ? 'text-primary' : 'text-foreground/60'
        }`}
      >
        {isConnected ? deviceName ?? 'Cast' : 'Cast'}
      </span>
    </button>
  );
}
