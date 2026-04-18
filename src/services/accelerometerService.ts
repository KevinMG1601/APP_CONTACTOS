import { Motion } from '@capacitor/motion';
import type { PluginListenerHandle } from '@capacitor/core';

export async function requestDeviceMotionPermission(): Promise<boolean> {
  const req = (DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> })
    .requestPermission;
  if (typeof req !== 'function') return true;
  try {
    const state = await req.call(DeviceMotionEvent);
    return state === 'granted';
  } catch {
    return false;
  }
}

export async function startAccelListener(
  onSample: (x: number, y: number, z: number) => void
): Promise<() => Promise<void>> {
  const handle: PluginListenerHandle = await Motion.addListener('accel', (ev) => {
    const a = ev.accelerationIncludingGravity ?? ev.acceleration;
    if (!a) return;
    onSample(a.x ?? 0, a.y ?? 0, a.z ?? 0);
  });
  return async () => {
    await handle.remove();
  };
}

export async function stopAllMotion(): Promise<void> {
  await Motion.removeAllListeners();
}
