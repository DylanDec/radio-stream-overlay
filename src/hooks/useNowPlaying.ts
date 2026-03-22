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
  // Store the API-reported elapsed and the local timestamp when we received it
  const elapsedBase = useRef({ apiElapsed: 0, receivedAt: 0, duration: 0 });

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
        const apiElapsed = np.elapsed || 0;
        const apiDuration = np.duration || 0;

        // Update base reference for smooth local ticking
        elapsedBase.current = {
          apiElapsed,
          receivedAt: performance.now(),
          duration: apiDuration,
        };

        lastSongId.current = song.id;

        setNowPlaying({
          title: song.title || 'Unknown',
          artist: song.artist || 'Unknown',
          album: song.album || undefined,
          artUrl: song.art || undefined,
          elapsed: apiElapsed,
          duration: apiDuration,
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

  // Smooth local elapsed tick based on the API baseline + real time delta
  useEffect(() => {
    const interval = setInterval(() => {
      const base = elapsedBase.current;
      if (!base.receivedAt) return;
      const delta = (performance.now() - base.receivedAt) / 1000;
      const computed = Math.min(base.apiElapsed + delta, base.duration || Infinity);
      setNowPlaying((prev) => {
        if (Math.abs((prev.elapsed || 0) - computed) < 0.3) return prev;
        return { ...prev, elapsed: computed };
      });
    }, 250);
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
