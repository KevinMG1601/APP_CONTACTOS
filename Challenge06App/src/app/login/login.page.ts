import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly loadingCtrl = inject(LoadingController);
  private readonly toastCtrl = inject(ToastController);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submitting = false;

  async login(): Promise<void> {
    if (this.form.invalid || this.submitting) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.getRawValue();
    const loading = await this.loadingCtrl.create({ message: 'Iniciando sesión…' });
    await loading.present();
    this.submitting = true;
    try {
      await this.auth.login(email, password);
      await this.router.navigateByUrl('/tabs', { replaceUrl: true });
    } catch (e: unknown) {
      await this.showError(e, 'No se pudo iniciar sesión');
    } finally {
      this.submitting = false;
      await loading.dismiss();
    }
  }

  async register(): Promise<void> {
    if (this.form.invalid || this.submitting) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.getRawValue();
    const loading = await this.loadingCtrl.create({ message: 'Creando cuenta…' });
    await loading.present();
    this.submitting = true;
    try {
      await this.auth.register(email, password);
      await this.router.navigateByUrl('/tabs', { replaceUrl: true });
    } catch (e: unknown) {
      await this.showError(e, 'No se pudo registrar');
    } finally {
      this.submitting = false;
      await loading.dismiss();
    }
  }

  private async showError(e: unknown, fallback: string): Promise<void> {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as { message: string }).message) : fallback;
    const t = await this.toastCtrl.create({ message: msg, duration: 3500, color: 'danger', position: 'top' });
    await t.present();
  }
}
