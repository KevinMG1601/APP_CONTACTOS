import { Component, inject } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { NetworkService } from '../core/services/network.service';
import { TaskItem, TasksService } from '../core/services/tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: false,
})
export class TasksPage {
  private readonly tasksSvc = inject(TasksService);
  private readonly auth = inject(AuthService);
  private readonly network = inject(NetworkService);
  private readonly alertCtrl = inject(AlertController);
  private readonly loadingCtrl = inject(LoadingController);
  private readonly toastCtrl = inject(ToastController);

  readonly online$ = this.network.online$;
  readonly tasks$: Observable<TaskItem[]> = this.auth.user$.pipe(
    switchMap((u) => this.tasksSvc.tasks$(u?.uid))
  );

  trackById(_i: number, t: TaskItem): string {
    return t.id;
  }

  async add(): Promise<void> {
    const a = await this.alertCtrl.create({
      header: 'Nueva tarea',
      inputs: [{ name: 'title', type: 'text', placeholder: 'Descripción' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Añadir',
          handler: async (data) => {
            const uid = this.auth.currentUser?.uid;
            const title = (data.title ?? '').trim();
            if (!uid || !title) {
              return false;
            }
            const loading = await this.loadingCtrl.create({ message: 'Guardando…' });
            await loading.present();
            try {
              await this.tasksSvc.add(uid, title);
              await this.okToast(
                this.network.isOnline() ? 'Tarea creada' : 'Sin conexión: tarea en cola; se subirá al reconectar'
              );
            } catch (e: unknown) {
              await this.errToast(e);
              return false;
            } finally {
              await loading.dismiss();
            }
            return true;
          },
        },
      ],
    });
    await a.present();
  }

  async toggle(t: TaskItem, checked: boolean): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      return;
    }
    const loading = await this.loadingCtrl.create({ message: 'Actualizando…' });
    await loading.present();
    try {
      await this.tasksSvc.setCompleted(uid, t.id, checked);
      if (!this.network.isOnline()) {
        await this.okToast('Estado en cola; se sincronizará al reconectar');
      }
    } catch (e: unknown) {
      await this.errToast(e);
    } finally {
      await loading.dismiss();
    }
  }

  async remove(t: TaskItem): Promise<void> {
    const a = await this.alertCtrl.create({
      header: 'Eliminar tarea',
      message: `¿Eliminar "${t.title}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            const uid = this.auth.currentUser?.uid;
            if (!uid) {
              return;
            }
            const loading = await this.loadingCtrl.create({ message: 'Eliminando…' });
            await loading.present();
            try {
              await this.tasksSvc.delete(uid, t.id);
              await this.okToast(
                this.network.isOnline() ? 'Tarea eliminada' : 'Borrado en cola; se aplicará al reconectar'
              );
            } catch (e: unknown) {
              await this.errToast(e);
            } finally {
              await loading.dismiss();
            }
          },
        },
      ],
    });
    await a.present();
  }

  private async okToast(message: string): Promise<void> {
    const t = await this.toastCtrl.create({ message, duration: 2200, color: 'success', position: 'top' });
    await t.present();
  }

  private async errToast(e: unknown): Promise<void> {
    const msg =
      e && typeof e === 'object' && 'message' in e ? String((e as { message: string }).message) : 'Error';
    const t = await this.toastCtrl.create({ message: msg, duration: 3500, color: 'danger', position: 'top' });
    await t.present();
  }
}
