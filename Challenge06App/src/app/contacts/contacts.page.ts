import { Component, inject } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { Contact, ContactsService } from '../core/services/contacts.service';
import { NetworkService } from '../core/services/network.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
  standalone: false,
})
export class ContactsPage {
  private readonly contactsSvc = inject(ContactsService);
  private readonly auth = inject(AuthService);
  private readonly network = inject(NetworkService);
  private readonly alertCtrl = inject(AlertController);
  private readonly loadingCtrl = inject(LoadingController);
  private readonly toastCtrl = inject(ToastController);

  readonly online$ = this.network.online$;
  readonly contacts$: Observable<Contact[]> = this.auth.user$.pipe(
    switchMap((u) => this.contactsSvc.contacts$(u?.uid))
  );

  trackById(_i: number, c: Contact): string {
    return c.id;
  }

  async add(): Promise<void> {
    const a = await this.alertCtrl.create({
      header: 'Nuevo contacto',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Nombre' },
        { name: 'email', type: 'email', placeholder: 'Email' },
        { name: 'phone', type: 'tel', placeholder: 'Teléfono' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async (data) => {
            const uid = this.auth.currentUser?.uid;
            if (!uid || !data.name?.trim()) {
              return false;
            }
            const loading = await this.loadingCtrl.create({ message: 'Guardando…' });
            await loading.present();
            try {
              await this.contactsSvc.add(uid, {
                name: data.name.trim(),
                email: (data.email ?? '').trim(),
                phone: (data.phone ?? '').trim(),
              });
              await this.okToast(
                this.network.isOnline() ? 'Contacto guardado' : 'Sin conexión: contacto en cola; se subirá al reconectar'
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

  async edit(c: Contact): Promise<void> {
    const a = await this.alertCtrl.create({
      header: 'Editar contacto',
      inputs: [
        { name: 'name', type: 'text', value: c.name, placeholder: 'Nombre' },
        { name: 'email', type: 'email', value: c.email, placeholder: 'Email' },
        { name: 'phone', type: 'tel', value: c.phone, placeholder: 'Teléfono' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async (data) => {
            const uid = this.auth.currentUser?.uid;
            if (!uid || !data.name?.trim()) {
              return false;
            }
            const loading = await this.loadingCtrl.create({ message: 'Actualizando…' });
            await loading.present();
            try {
              await this.contactsSvc.update(uid, {
                id: c.id,
                name: data.name.trim(),
                email: (data.email ?? '').trim(),
                phone: (data.phone ?? '').trim(),
              });
              await this.okToast(
                this.network.isOnline() ? 'Contacto actualizado' : 'Cambio en cola; se sincronizará al reconectar'
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

  async remove(c: Contact): Promise<void> {
    const a = await this.alertCtrl.create({
      header: 'Eliminar',
      message: `¿Eliminar a ${c.name}?`,
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
              await this.contactsSvc.delete(uid, c.id);
              await this.okToast(
                this.network.isOnline() ? 'Contacto eliminado' : 'Borrado en cola; se aplicará al reconectar'
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
    const t = await this.toastCtrl.create({ message, duration: 2000, color: 'success', position: 'top' });
    await t.present();
  }

  private async errToast(e: unknown): Promise<void> {
    const msg =
      e && typeof e === 'object' && 'message' in e ? String((e as { message: string }).message) : 'Error';
    const t = await this.toastCtrl.create({ message: msg, duration: 3500, color: 'danger', position: 'top' });
    await t.present();
  }
}
