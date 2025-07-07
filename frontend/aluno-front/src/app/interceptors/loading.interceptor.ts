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
import { SKIP_LOADING } from '../shared/loading-context.token';

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
    const skipLoading = req.context.get(SKIP_LOADING) === true;

    if (!skipLoading) {
      this.loggerService.debug(
        '[LoadingInterceptor] Executando o show para ' + req.url
      );
      this.loadingService.show();
    } else {
      this.loggerService.debug(
        '[LoadingInterceptor] Pulando o show para ' + req.url
      );
    }

    return next.handle(req).pipe(
      finalize(() => {
        if (!skipLoading) {
          this.loggerService.debug(
            '[LoadingInterceptor] finalize -> hide para ' + req.url
          );
          this.loadingService.hide();
        }
      })
    );
  }
}
