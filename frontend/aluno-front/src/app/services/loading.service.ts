import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  loading$ = this._loading.asObservable();
  private contador = 0;

  show(): void {
    this.contador++;
    this._loading.next(true);
  }

  hide(): void {
    this.contador = Math.max(0, this.contador - 1);
    if (this.contador === 0) {
      this._loading.next(false);
    }
  }
}
