import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { Database, push, ref, remove, set, update } from '@angular/fire/database';
import { Auth } from '@angular/fire/auth';
import { appDb, PendingOp, PendingOpKind } from '../db/app-database';
import { NetworkService } from './network.service';

@Injectable({ providedIn: 'root' })
export class PendingSyncService {
  private readonly firestore = inject(Firestore);
  private readonly database = inject(Database);
  private readonly auth = inject(Auth);
  private readonly network = inject(NetworkService);

  constructor() {
    this.network.online$.subscribe((online) => {
      if (online) {
        void this.flush();
      }
    });
  }

  async enqueue(kind: PendingOpKind, payload: Record<string, unknown>): Promise<void> {
    await appDb.pendingOps.add({
      kind,
      payload: JSON.stringify(payload),
      createdAt: Date.now(),
    });
  }

  async flush(): Promise<void> {
    if (!this.network.isOnline()) {
      return;
    }
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      return;
    }
    const ops = await appDb.pendingOps.orderBy('id').toArray();
    for (const op of ops) {
      try {
        await this.applyOp(uid, op);
        if (op.id != null) {
          await appDb.pendingOps.delete(op.id);
        }
      } catch {
        break;
      }
    }
  }

  async pendingCount(): Promise<number> {
    return appDb.pendingOps.count();
  }

  private async applyOp(uid: string, op: PendingOp): Promise<void> {
    const data = JSON.parse(op.payload) as Record<string, unknown>;
    const contactsCol = collection(this.firestore, 'users', uid, 'contacts');
    switch (op.kind) {
      case 'contact-create':
        await addDoc(contactsCol, {
          name: data['name'],
          email: data['email'],
          phone: data['phone'],
        });
        break;
      case 'contact-update':
        await updateDoc(doc(this.firestore, 'users', uid, 'contacts', String(data['id'])), {
          name: data['name'],
          email: data['email'],
          phone: data['phone'],
        });
        break;
      case 'contact-delete':
        await deleteDoc(doc(this.firestore, 'users', uid, 'contacts', String(data['id'])));
        break;
      case 'task-create': {
        const tasksRef = ref(this.database, `users/${uid}/tasks`);
        const newRef = push(tasksRef);
        await set(newRef, {
          title: data['title'],
          completed: false,
        });
        break;
      }
      case 'task-toggle':
        await update(ref(this.database, `users/${uid}/tasks/${data['id']}`), {
          completed: data['completed'],
        });
        break;
      case 'task-delete':
        await remove(ref(this.database, `users/${uid}/tasks/${data['id']}`));
        break;
      default:
        break;
    }
  }
}
