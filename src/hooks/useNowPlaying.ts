import { useState, useEffect, useCallback, useRef } from 'react';

export interface NowPlayingData {
  title: string;
  artist: string;
  album?: string;
  artUrl?: string;
  elapsed?: number;
  duration?: number;
  isLive?: boolean;
  streamerName?: string;
}

export interface NextTrack {
  title: string;
  artist: string;
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

// ============================================================
// CONFIGURATION — Change this to your AzuraCast API endpoint
// ============================================================
const AZURACAST_API_URL = '/api/nowplaying';
const POLL_INTERVAL = 10_000;

export function useNowPlaying() {
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData>({
    title: 'Midnight Drive',
    artist: 'Luna Waves',
    album: 'Neon Dreams',
    duration: 247,
    elapsed: 83,
  });
  const [nextTrack, setNextTrack] = useState<NextTrack>({
    title: 'Electric Sunset',
    artist: 'The Dusk Collective',
  });
  const [showTheme, setShowTheme] = useState<ShowTheme>(getShowByHour(new Date().getHours()));
  const prevTitleRef = useRef('');
  const apiConnected = useRef(false);

  const fetchNowPlaying = useCallback(async () => {
    try {
      const res = await fetch(AZURACAST_API_URL);
      if (!res.ok) return;
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) return;

      const data = await res.json();
      const song = data?.now_playing?.song;
      const next = data?.playing_next?.song;
      const live = data?.live;

      if (song) {
        apiConnected.current = true;
        const newTitle = `${song.artist} - ${song.title}`;
        prevTitleRef.current = newTitle;

        setNowPlaying({
          title: song.title || 'Unknown',
          artist: song.artist || 'Unknown',
          album: song.album || undefined,
          artUrl: song.art || undefined,
          elapsed: data.now_playing.elapsed || 0,
          duration: data.now_playing.duration || 0,
          isLive: live?.is_live || false,
          streamerName: live?.streamer_name || undefined,
        });
      }

      if (next) {
        setNextTrack({
          title: next.title || 'Unknown',
          artist: next.artist || 'Unknown',
        });
      }
    } catch {
      // API unavailable — keep demo data
    }
  }, []);

  // Poll API
  useEffect(() => {
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNowPlaying]);

  // Tick elapsed time every second (works for both demo and live)
  useEffect(() => {
    const interval = setInterval(() => {
      setNowPlaying((prev) => {
        const newElapsed = (prev.elapsed || 0) + 1;
        if (prev.duration && newElapsed >= prev.duration) {
          return prev; // Don't exceed duration, wait for API update
        }
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
