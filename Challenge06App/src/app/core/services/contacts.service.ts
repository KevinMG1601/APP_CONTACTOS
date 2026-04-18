import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { PendingSyncService } from './pending-sync.service';
import { NetworkService } from './network.service';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
}

@Injectable({ providedIn: 'root' })
export class ContactsService {
  private readonly firestore = inject(Firestore);
  private readonly network = inject(NetworkService);
  private readonly pendingSync = inject(PendingSyncService);

  contacts$(uid: string | null | undefined): Observable<Contact[]> {
    if (!uid) {
      return of([]);
    }
    const col = collection(this.firestore, 'users', uid, 'contacts');
    return collectionData(col, { idField: 'id' }) as Observable<Contact[]>;
  }

  async add(uid: string, contact: Omit<Contact, 'id'>): Promise<void> {
    if (!this.network.isOnline()) {
      await this.pendingSync.enqueue('contact-create', { ...contact });
      return;
    }
    const col = collection(this.firestore, 'users', uid, 'contacts');
    await addDoc(col, {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    });
  }

  async update(uid: string, contact: Contact): Promise<void> {
    if (!this.network.isOnline()) {
      await this.pendingSync.enqueue('contact-update', {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
      });
      return;
    }
    await updateDoc(doc(this.firestore, 'users', uid, 'contacts', contact.id), {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    });
  }

  async delete(uid: string, id: string): Promise<void> {
    if (!this.network.isOnline()) {
      await this.pendingSync.enqueue('contact-delete', { id });
      return;
    }
    await deleteDoc(doc(this.firestore, 'users', uid, 'contacts', id));
  }
}
