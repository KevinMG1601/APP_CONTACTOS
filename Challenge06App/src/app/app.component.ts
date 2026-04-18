import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Auth, authState } from '@angular/fire/auth';
import { filter, map, pairwise } from 'rxjs/operators';
import { PendingSyncService } from './core/services/pending-sync.service';
import { NetworkService } from './core/services/network.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private readonly network = inject(NetworkService);
  private readonly router = inject(Router);
  private readonly auth = inject(Auth);
  private readonly toastCtrl = inject(ToastController);
  private readonly pendingSync = inject(PendingSyncService);

  readonly offlineBanner$ = this.network.online$.pipe(map((o) => !o));

  async ngOnInit(): Promise<void> {
    void this.pendingSync;
    await this.network.init();

    authState(this.auth).subscribe((user) => {
      const onLogin = this.router.url.includes('/login');
      if (user && onLogin) {
        void this.router.navigateByUrl('/tabs', { replaceUrl: true });
      }
      if (!user && this.router.url.startsWith('/tabs')) {
        void this.router.navigateByUrl('/login', { replaceUrl: true });
      }
    });

    this.network.online$
      .pipe(
        pairwise(),
        filter(([prev, curr]) => prev && !curr)
      )
      .subscribe(async () => {
        const t = await this.toastCtrl.create({
          message: 'Sin conexión - Contacts y Tasks limitados',
          duration: 4000,
          color: 'warning',
          position: 'top',
        });
        await t.present();
      });
  }
}
