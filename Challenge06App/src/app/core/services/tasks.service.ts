import { Injectable, inject } from '@angular/core';
import { Database, listVal, push, ref, remove, set, update } from '@angular/fire/database';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PendingSyncService } from './pending-sync.service';
import { NetworkService } from './network.service';

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
}

@Injectable({ providedIn: 'root' })
export class TasksService {
  private readonly database = inject(Database);
  private readonly network = inject(NetworkService);
  private readonly pendingSync = inject(PendingSyncService);

  tasks$(uid: string | null | undefined): Observable<TaskItem[]> {
    if (!uid) {
      return of([]);
    }
    const tasksRef = ref(this.database, `users/${uid}/tasks`);
    return listVal<TaskItem | null>(tasksRef, { keyField: 'id' }).pipe(
      map((rows) => (rows ?? []).filter((t): t is TaskItem => t != null && !!t.id))
    );
  }

  async add(uid: string, title: string): Promise<void> {
    if (!this.network.isOnline()) {
      await this.pendingSync.enqueue('task-create', { title });
      return;
    }
    const tasksRef = ref(this.database, `users/${uid}/tasks`);
    const newRef = push(tasksRef);
    await set(newRef, { title, completed: false });
  }

  async setCompleted(uid: string, id: string, completed: boolean): Promise<void> {
    if (!this.network.isOnline()) {
      await this.pendingSync.enqueue('task-toggle', { id, completed });
      return;
    }
    await update(ref(this.database, `users/${uid}/tasks/${id}`), { completed });
  }

  async delete(uid: string, id: string): Promise<void> {
    if (!this.network.isOnline()) {
      await this.pendingSync.enqueue('task-delete', { id });
      return;
    }
    await remove(ref(this.database, `users/${uid}/tasks/${id}`));
  }
}
