import Dexie, { Table } from 'dexie';

export interface Fruit {
  id?: number;
  name: string;
  color: string;
  price: number;
}

export interface PendingOp {
  id?: number;
  kind: PendingOpKind;
  payload: string;
  createdAt: number;
}

export type PendingOpKind =
  | 'contact-create'
  | 'contact-update'
  | 'contact-delete'
  | 'task-create'
  | 'task-toggle'
  | 'task-delete';

export class Challenge06Dexie extends Dexie {
  fruits!: Table<Fruit, number>;
  pendingOps!: Table<PendingOp, number>;

  constructor() {
    super('Challenge06DB');
    this.version(1).stores({
      fruits: '++id, name, color, price',
      pendingOps: '++id, kind, createdAt',
    });
  }
}

export const appDb = new Challenge06Dexie();
