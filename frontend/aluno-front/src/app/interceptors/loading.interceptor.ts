import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { LoadingService } from '../services/loading.service';
import { finalize, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(
    private loadingService: LoadingService,
    private loggerService: LoggerService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loggerService.debug('[LoadingInterceptor] Executando o show');
    this.loadingService.show();
    return next.handle(req).pipe(
      finalize(() => {
        this.loggerService.debug('[LoadingInterceptor] finalize -> hide');
        this.loadingService.hide();
      })
    );
  }
}
