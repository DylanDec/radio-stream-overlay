import { useMemo } from 'react';

const BAR_COUNT = 32;

export function Equalizer() {
  const bars = useMemo(
    () =>
    Array.from({ length: BAR_COUNT }, (_, i) => ({
      delay: Math.random() * 1.5,
      speed: 0.4 + Math.random() * 0.8,
      maxH: 30 + Math.random() * 70
    })),
    []
  );

  return;













}