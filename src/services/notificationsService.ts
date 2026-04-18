import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

let channelReady = false;

async function ensureChannel(): Promise<void> {
  if (!Capacitor.isNativePlatform() || channelReady) return;
  try {
    await LocalNotifications.createChannel({
      id: 'missions',
      name: 'Misiones',
      importance: 4,
      vibration: true,
    });
    channelReady = true;
  } catch {
    channelReady = true;
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  await ensureChannel();
  const res = await LocalNotifications.requestPermissions();
  return res.display === 'granted';
}

export async function notifyMission(body: string, title = 'Misiones'): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  await ensureChannel();
  const perm = await LocalNotifications.checkPermissions();
  if (perm.display !== 'granted') return;
  await LocalNotifications.schedule({
    notifications: [
        {
          id: Math.floor(Math.random() * 1_000_000) + 1,
          title,
          body,
          channelId: 'missions',
        },
    ],
  });
}
