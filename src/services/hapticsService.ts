import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

export async function missionCompleteHaptics(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await Haptics.impact({ style: ImpactStyle.Heavy });
    await Haptics.vibrate({ duration: 350 });
  } catch {
    try {
      await Haptics.vibrate({ duration: 400 });
    } catch {
      /* noop */
    }
  }
}
