import { useState, useEffect, useCallback } from 'react';
import { CONFIG } from '@/config';

export interface ScheduleEntry {
  id: number;
  name: string;
  description: string;
  start: string;
  end: string;
  startTimestamp: number;
  endTimestamp: number;
  isNow: boolean;
  type: 'playlist' | 'streamer';
}

function parseSchedule(items: any[]): ScheduleEntry[] {
  const now = Date.now() / 1000;
  return items.map((item) => {
    const startTs = item.start_timestamp ?? 0;
    const endTs = item.end_timestamp ?? 0;
    return {
      id: item.id ?? 0,
      name: item.name ?? 'Onbekend',
      description: item.description ?? '',
      start: item.start ?? '',
      end: item.end ?? '',
      startTimestamp: startTs,
      endTimestamp: endTs,
      isNow: now >= startTs && now < endTs,
      type: item.type ?? 'playlist',
    };
  });
}

export function useSchedule() {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [currentShow, setCurrentShow] = useState<ScheduleEntry | null>(null);

  const fetchSchedule = useCallback(async () => {
    try {
      const res = await fetch(CONFIG.AZURACAST_SCHEDULE_URL);
      if (!res.ok) return;
      const data = await res.json();
      const entries = parseSchedule(Array.isArray(data) ? data : []);
      setSchedule(entries);
      setCurrentShow(entries.find((e) => e.isNow) ?? null);
    } catch {
      // API unavailable
    }
  }, []);

  useEffect(() => {
    fetchSchedule();
    const interval = setInterval(fetchSchedule, CONFIG.POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchSchedule]);

  return { schedule, currentShow };
}
