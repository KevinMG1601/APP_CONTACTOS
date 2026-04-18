import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { appDb, Fruit } from '../db/app-database';

@Injectable({ providedIn: 'root' })
export class FruitsService {
  list$(): Observable<Fruit[]> {
    return from(appDb.fruits.orderBy('name').toArray());
  }

  async add(fruit: Omit<Fruit, 'id'>): Promise<number> {
    return appDb.fruits.add({ ...fruit });
  }

  async delete(id: number): Promise<void> {
    await appDb.fruits.delete(id);
  }

  searchByName$(query: string): Observable<Fruit[]> {
    const q = query.trim().toLowerCase();
    return from(appDb.fruits.toArray()).pipe(
      map((all) =>
        q ? all.filter((f) => f.name.toLowerCase().includes(q)) : all.sort((a, b) => a.name.localeCompare(b.name))
      )
    );
  }
}
