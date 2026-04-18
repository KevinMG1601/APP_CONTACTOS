import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable, combineLatest, switchMap } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Fruit } from '../core/db/app-database';
import { FruitsService } from '../core/services/fruits.service';

@Component({
  selector: 'app-fruits',
  templateUrl: './fruits.page.html',
  styleUrls: ['./fruits.page.scss'],
  standalone: false,
})
export class FruitsPage {
  private readonly fb = inject(FormBuilder);
  private readonly fruitsSvc = inject(FruitsService);
  private readonly toastCtrl = inject(ToastController);

  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  private readonly searchTerm$ = new BehaviorSubject<string>('');

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    color: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
  });

  readonly filteredFruits$: Observable<Fruit[]> = combineLatest([
    this.refresh$.pipe(switchMap(() => this.fruitsSvc.list$())),
    this.searchTerm$.pipe(startWith('')),
  ]).pipe(
    map(([all, q]) => {
      const t = q.trim().toLowerCase();
      const sorted = [...all].sort((a, b) => a.name.localeCompare(b.name));
      if (!t) {
        return sorted;
      }
      return sorted.filter((f) => f.name.toLowerCase().includes(t));
    })
  );

  onSearch(ev: CustomEvent): void {
    const v = (ev.detail as { value?: string | null }).value ?? '';
    this.searchTerm$.next(v);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, color, price } = this.form.getRawValue();
    await this.fruitsSvc.add({ name: name.trim(), color: color.trim(), price: Number(price) });
    this.form.reset({ name: '', color: '', price: 0 });
    this.refresh$.next();
    const t = await this.toastCtrl.create({
      message: 'Fruta guardada en IndexedDB (Dexie)',
      duration: 2000,
      color: 'success',
      position: 'top',
    });
    await t.present();
  }

  async remove(f: Fruit): Promise<void> {
    if (f.id == null) {
      return;
    }
    await this.fruitsSvc.delete(f.id);
    this.refresh$.next();
    const t = await this.toastCtrl.create({ message: 'Eliminada', duration: 1500, color: 'medium', position: 'top' });
    await t.present();
  }

  trackById(_i: number, f: Fruit): number | undefined {
    return f.id;
  }
}
