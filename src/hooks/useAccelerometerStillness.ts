import { useCallback, useRef, useState } from 'react';
import {
  requestDeviceMotionPermission,
  startAccelListener,
  stopAllMotion,
} from '../services/accelerometerService';
import { MOTION_DELTA_THRESHOLD, STILLNESS_MS } from '../utils/missions';

export function useAccelerometerStillness() {
  const [active, setActive] = useState(false);
  const [quietMs, setQuietMs] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const stopRef = useRef<(() => Promise<void>) | null>(null);
  const lastSample = useRef<{ x: number; y: number; z: number } | null>(null);
  const spikeRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const accumRef = useRef(0);
  const lastTsRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  const cleanup = useCallback(async () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastTsRef.current = null;
    accumRef.current = 0;
    lastSample.current = null;
    spikeRef.current = false;
    doneRef.current = false;
    setQuietMs(0);
    if (stopRef.current) {
      await stopRef.current();
      stopRef.current = null;
    }
    await stopAllMotion();
    setActive(false);
  }, []);

  const start = useCallback(
    async (onComplete: () => void) => {
      setError(null);
      setQuietMs(0);
      accumRef.current = 0;
      lastSample.current = null;
      spikeRef.current = false;
      doneRef.current = false;
      const ok = await requestDeviceMotionPermission();
      if (!ok) {
        setError('Permiso de movimiento denegado.');
        return;
      }
      try {
        const stopListen = await startAccelListener((x, y, z) => {
          const prev = lastSample.current;
          lastSample.current = { x, y, z };
          if (!prev) return;
          const dx = x - prev.x;
          const dy = y - prev.y;
          const dz = z - prev.z;
          const mag = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (mag > MOTION_DELTA_THRESHOLD) {
            spikeRef.current = true;
          }
        });
        stopRef.current = stopListen;
        setActive(true);
        const tick = (ts: number) => {
          if (!stopRef.current || doneRef.current) return;
          const last = lastTsRef.current;
          lastTsRef.current = ts;
          if (last != null) {
            const dt = ts - last;
            if (spikeRef.current) {
              accumRef.current = 0;
              spikeRef.current = false;
            } else {
              accumRef.current += dt;
            }
            setQuietMs(Math.min(Math.floor(accumRef.current), STILLNESS_MS));
            if (accumRef.current >= STILLNESS_MS) {
              doneRef.current = true;
              void cleanup().then(() => onComplete());
              return;
            }
          }
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Error del sensor.';
        setError(msg);
        await cleanup();
      }
    },
    [cleanup]
  );

  return { active, quietMs, error, start, stop: cleanup };
}
