import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';

/**
 * No bloquea la navegación cuando hay pérdida de red: Contacts y Tasks pasan a
 * modo solo lectura / cola local (ver NetworkService en páginas hijas).
 */
@Injectable({ providedIn: 'root' })
export class NetworkGuard implements CanActivate {
  canActivate(): Observable<boolean> {
    return of(true);
  }
}
