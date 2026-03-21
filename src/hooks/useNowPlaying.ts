import { useState, useEffect, useCallback, useRef } from 'react';
import { CONFIG } from '@/config';

export interface NowPlayingData {
  title: string;
  artist: string;
  album?: string;
  artUrl?: string;
  elapsed?: number;
  duration?: number;
  isLive?: boolean;
  streamerName?: string;
  listeners?: number;
  playlist?: string;
}

export interface NextTrack {
  title: string;
  artist: string;
  artUrl?: string;
}

export interface ShowTheme {
  id: 'morning' | 'afternoon' | 'evening' | 'night';
  label: string;
}

const SHOW_THEMES: Record<ShowTheme['id'], ShowTheme> = {
  morning: { id: 'morning', label: 'Ochtendshow' },
  afternoon: { id: 'afternoon', label: 'Middagmix' },
  evening: { id: 'evening', label: 'Avondshow' },
  night: { id: 'night', label: 'Nachtshift' },
};

function getShowByHour(hour: number): ShowTheme {
  if (hour >= 6 && hour < 12) return SHOW_THEMES.morning;
  if (hour >= 12 && hour < 18) return SHOW_THEMES.afternoon;
  if (hour >= 18 && hour < 23) return SHOW_THEMES.evening;
  return SHOW_THEMES.night;
}

export function useNowPlaying() {
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData>({
    title: 'Wachten op data…',
    artist: '',
    duration: 0,
    elapsed: 0,
  });
  const [nextTrack, setNextTrack] = useState<NextTrack>({
    title: '',
    artist: '',
  });
  const [showTheme, setShowTheme] = useState<ShowTheme>(getShowByHour(new Date().getHours()));
  const lastSongId = useRef('');

  const fetchNowPlaying = useCallback(async () => {
    try {
      const res = await fetch(CONFIG.AZURACAST_API_URL);
      if (!res.ok) return;
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) return;

      const data = await res.json();
      const np = data?.now_playing;
      const song = np?.song;
      const next = data?.playing_next?.song;
      const live = data?.live;

      if (song) {
        lastSongId.current = song.id;

        setNowPlaying({
          title: song.title || 'Unknown',
          artist: song.artist || 'Unknown',
          album: song.album || undefined,
          artUrl: song.art || undefined,
          elapsed: np.elapsed || 0,
          duration: np.duration || 0,
          isLive: live?.is_live || false,
          streamerName: live?.streamer_name || undefined,
          listeners: data?.listeners?.current,
          playlist: np.playlist || undefined,
        });
      }

      if (next) {
        setNextTrack({
          title: next.title || 'Unknown',
          artist: next.artist || 'Unknown',
          artUrl: next.art || undefined,
        });
      }
    } catch {
      // API unavailable — keep current data
    }
  }, []);

  // Poll API
  useEffect(() => {
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, CONFIG.POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNowPlaying]);

  // Tick elapsed time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setNowPlaying((prev) => {
        const newElapsed = (prev.elapsed || 0) + 1;
        if (prev.duration && newElapsed >= prev.duration) return prev;
        return { ...prev, elapsed: newElapsed };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update show theme every minute
  useEffect(() => {
    const updateTheme = () => setShowTheme(getShowByHour(new Date().getHours()));
    updateTheme();
    const interval = setInterval(updateTheme, 60_000);
    return () => clearInterval(interval);
  }, []);

  return { nowPlaying, nextTrack, showTheme };
}
