import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  constructor(private loggerService: LoggerService) {}

  private _loading = new BehaviorSubject<boolean>(false);
  loading$ = this._loading.asObservable();
  private contador = 0;

  show(): void {
    this.loggerService.debug(
      '[LoadingService] show contador: ' + this.contador
    );
    this.contador++;
    this._loading.next(true);
  }

  hide(): void {
    this.loggerService.debug(
      '[LoadingService] hide contador: ' + this.contador
    );

    this.contador = Math.max(0, this.contador - 1);
    if (this.contador === 0) {
      this._loading.next(false);
    }
  }
}
