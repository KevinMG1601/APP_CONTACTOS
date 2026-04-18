import { Injectable, NgZone } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NetworkService {
  private readonly onlineSubject = new BehaviorSubject<boolean>(true);
  readonly online$: Observable<boolean> = this.onlineSubject.asObservable().pipe(
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(private readonly zone: NgZone) {}

  isOnline(): boolean {
    return this.onlineSubject.value;
  }

  async init(): Promise<void> {
    await this.refreshStatus();
    if (Capacitor.getPlatform() === 'web') {
      this.zone.runOutsideAngular(() => {
        window.addEventListener('online', () => this.zone.run(() => this.onlineSubject.next(true)));
        window.addEventListener('offline', () => this.zone.run(() => this.onlineSubject.next(false)));
      });
    }
    await Network.addListener('networkStatusChange', (s) => {
      this.zone.run(() => this.onlineSubject.next(!!s.connected));
    });
  }

  private async refreshStatus(): Promise<void> {
    try {
      const status = await Network.getStatus();
      this.onlineSubject.next(!!status.connected);
    } catch {
      this.onlineSubject.next(typeof navigator !== 'undefined' ? navigator.onLine : true);
    }
  }
}
