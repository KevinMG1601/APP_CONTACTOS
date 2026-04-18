import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

export async function captureAndSaveEvidence(): Promise<string> {
  const photo = await Camera.getPhoto({
    quality: 85,
    allowEditing: false,
    resultType: CameraResultType.Base64,
    source: CameraSource.Camera,
  });
  if (!photo.base64String) {
    throw new Error('No se recibio imagen de la camara.');
  }
  const fileName = `missions/evidence-${Date.now()}.jpg`;
  await Filesystem.writeFile({
    path: fileName,
    data: photo.base64String,
    directory: Directory.Data,
  });
  if (Capacitor.isNativePlatform()) {
    return `${Directory.Data}/${fileName}`;
  }
  return fileName;
}
