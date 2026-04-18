import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { haversineMeters } from '../utils/distance';

function isAppleMobileWeb(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const isApple = /iPhone|iPad|iPod/i.test(ua);
  const isWeb = Capacitor.getPlatform() === 'web';
  return isApple && isWeb;
}

function isAppleNative(): boolean {
  return Capacitor.getPlatform() === 'ios';
}

function useRelaxedGeo(): boolean {
  return isAppleMobileWeb() || isAppleNative();
}

const GEO_PERMISSION_DENIED = 1;
const GEO_POSITION_UNAVAILABLE = 2;
const GEO_TIMEOUT = 3;

function readGeoErrorCode(err: unknown): number | null {
  if (err == null || typeof err !== 'object') return null;
  const o = err as { code?: unknown };
  if (typeof o.code === 'number' && Number.isFinite(o.code)) return o.code;
  if (typeof o.code === 'string') {
    const n = parseInt(o.code, 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function messageFromGeoCode(code: number): string {
  switch (code) {
    case GEO_PERMISSION_DENIED:
      return 'Ubicacion denegada. En iPhone revisa Ajustes, Safari y permisos de ubicacion.';
    case GEO_POSITION_UNAVAILABLE:
      return 'Ubicacion no disponible. Sal al exterior o espera unos segundos.';
    case GEO_TIMEOUT:
      return 'Tiempo de espera agotado. Mejor senal GPS o intentalo de nuevo.';
    default:
      return 'Error de geolocalizacion.';
  }
}

function formatGeoFailure(err: unknown): Error {
  const code = readGeoErrorCode(err);
  if (code != null) {
    return new Error(messageFromGeoCode(code));
  }

  if (typeof GeolocationPositionError !== 'undefined' && err instanceof GeolocationPositionError) {
    return new Error(messageFromGeoCode(err.code));
  }

  let raw = '';
  if (err instanceof Error) {
    raw = err.message;
  } else if (err && typeof err === 'object' && 'message' in err) {
    raw = String((err as { message: unknown }).message);
  } else {
    raw = String(err);
  }

  if (raw === '[object GeolocationPositionError]' || !raw.trim()) {
    return new Error('No se pudo obtener la ubicacion. Revisa permisos y HTTPS.');
  }

  const lower = raw.toLowerCase();
  if (lower.includes('denied') || lower.includes('permission')) {
    return new Error(messageFromGeoCode(GEO_PERMISSION_DENIED));
  }
  if (lower.includes('timeout') || lower.includes('timed out')) {
    return new Error(messageFromGeoCode(GEO_TIMEOUT));
  }
  if (lower.includes('unavailable') || lower.includes('kCLErrorLocationUnknown')) {
    return new Error(messageFromGeoCode(GEO_POSITION_UNAVAILABLE));
  }
  if (lower.includes('insecure') || lower.includes('secure origin')) {
    return new Error('La ubicacion en la web requiere HTTPS, no HTTP.');
  }
  return new Error(raw);
}

export async function ensureGeoPermissions(): Promise<void> {
  const perm = await Geolocation.checkPermissions();
  if (perm.location === 'granted') return;
  const req = await Geolocation.requestPermissions();
  if (req.location !== 'granted') {
    throw new Error('Permiso de ubicacion denegado.');
  }
}

async function getCurrentPositionOnce(enableHighAccuracy: boolean, timeoutMs: number) {
  return Geolocation.getCurrentPosition({
    enableHighAccuracy,
    timeout: timeoutMs,
    maximumAge: useRelaxedGeo() ? 60_000 : 5_000,
  });
}

export async function getCurrentLatLng(): Promise<{ lat: number; lng: number }> {
  const relaxed = useRelaxedGeo();
  const t1 = relaxed ? 45_000 : 20_000;
  const t2 = relaxed ? 60_000 : 25_000;
  try {
    const pos = await getCurrentPositionOnce(true, t1);
    return { lat: pos.coords.latitude, lng: pos.coords.longitude };
  } catch (e1) {
    if (!relaxed) {
      throw formatGeoFailure(e1);
    }
    try {
      const pos = await getCurrentPositionOnce(false, t2);
      return { lat: pos.coords.latitude, lng: pos.coords.longitude };
    } catch (e2) {
      throw formatGeoFailure(e2);
    }
  }
}

export function watchPosition(
  onUpdate: (lat: number, lng: number) => void,
  onError: (e: Error) => void
): Promise<string> {
  const relaxed = useRelaxedGeo();
  return Geolocation.watchPosition(
    {
      enableHighAccuracy: !relaxed,
      timeout: relaxed ? 45_000 : 20_000,
      maximumAge: relaxed ? 10_000 : 2_000,
    },
    (pos, err?: { message?: string; code?: string | number }) => {
      if (err) {
        onError(formatGeoFailure(err));
        return;
      }
      if (!pos) return;
      onUpdate(pos.coords.latitude, pos.coords.longitude);
    }
  );
}

export async function clearWatch(watchId: string): Promise<void> {
  await Geolocation.clearWatch({ id: watchId });
}

export function distanceFromStart(
  startLat: number,
  startLng: number,
  lat: number,
  lng: number
): number {
  return haversineMeters(startLat, startLng, lat, lng);
}
