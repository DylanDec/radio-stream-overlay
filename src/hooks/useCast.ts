import { useEffect, useState, useCallback } from 'react';
import { CONFIG } from '@/config';

// Minimal typings for the Cast SDK on window
declare global {
  interface Window {
    __onGCastApiAvailable?: (isAvailable: boolean) => void;
    cast?: any;
    chrome?: any;
  }
}

type CastStatus = 'unsupported' | 'unavailable' | 'idle' | 'connecting' | 'connected' | 'error';

export function useCast() {
  const [status, setStatus] = useState<CastStatus>('unsupported');
  const [deviceName, setDeviceName] = useState<string | null>(null);

  // Initialise Cast framework once it announces availability
  useEffect(() => {
    let cancelled = false;

    function init() {
      const cast = window.cast;
      const chrome = window.chrome;
      if (!cast?.framework || !chrome?.cast) return;

      const context = cast.framework.CastContext.getInstance();
      context.setOptions({
        // Default Media Receiver — public app, geen developer account nodig
        receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
        autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
      });

      const updateState = () => {
        const state = context.getCastState();
        // NO_DEVICES_AVAILABLE | NOT_CONNECTED | CONNECTING | CONNECTED
        if (state === 'NO_DEVICES_AVAILABLE') setStatus('unavailable');
        else if (state === 'NOT_CONNECTED') setStatus('idle');
        else if (state === 'CONNECTING') setStatus('connecting');
        else if (state === 'CONNECTED') {
          setStatus('connected');
          const session = context.getCurrentSession();
          setDeviceName(session?.getCastDevice?.()?.friendlyName ?? null);
        }
      };

      context.addEventListener(
        cast.framework.CastContextEventType.CAST_STATE_CHANGED,
        updateState
      );
      updateState();
    }

    if (window.cast?.framework) {
      init();
    } else {
      window.__onGCastApiAvailable = (isAvailable: boolean) => {
        if (cancelled) return;
        if (isAvailable) init();
        else setStatus('unsupported');
      };
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const startCasting = useCallback(async (metadata?: { title?: string; subtitle?: string; artwork?: string }) => {
    const cast = window.cast;
    const chrome = window.chrome;
    if (!cast?.framework || !chrome?.cast) return;

    const context = cast.framework.CastContext.getInstance();
    try {
      setStatus('connecting');
      await context.requestSession();
      const session = context.getCurrentSession();
      if (!session) {
        setStatus('idle');
        return;
      }

      const mediaInfo = new chrome.cast.media.MediaInfo(CONFIG.STREAM_URL, 'audio/mpeg');
      mediaInfo.streamType = chrome.cast.media.StreamType.LIVE;

      const meta = new chrome.cast.media.MusicTrackMediaMetadata();
      meta.title = metadata?.title ?? 'Live Radio';
      meta.artist = metadata?.subtitle ?? '';
      if (metadata?.artwork) {
        meta.images = [new chrome.cast.Image(metadata.artwork)];
      }
      mediaInfo.metadata = meta;

      const request = new chrome.cast.media.LoadRequest(mediaInfo);
      request.autoplay = true;
      await session.loadMedia(request);
    } catch (err) {
      console.error('Cast error', err);
      setStatus('error');
    }
  }, []);

  const stopCasting = useCallback(() => {
    const cast = window.cast;
    if (!cast?.framework) return;
    const context = cast.framework.CastContext.getInstance();
    context.endCurrentSession(true);
  }, []);

  return { status, deviceName, startCasting, stopCasting };
}
