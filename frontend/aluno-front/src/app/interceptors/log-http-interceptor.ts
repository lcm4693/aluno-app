import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class LogHTTP implements HttpInterceptor {
  private readonly production: Boolean = environment.production as Boolean;

  constructor(private loggerService: LoggerService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //Não logar o refresh e response do refresh
    const isRefreshRequest = req.url.includes('/auth/refresh');
    if (isRefreshRequest) {
      return next.handle(req);
    }

    if (!this.production) {
      this.loggerService.info('🔵 REQUEST');
      this.loggerService.info('URL:', req.urlWithParams);
      this.loggerService.info('Método:', req.method);
      if (req.body) this.loggerService.info('Body:', req.body);
      this.loggerService.info('Headers:', req.headers);
      this.loggerService.info(
        '==================================================================='
      );
    }
    return next.handle(req).pipe(
      tap({
        next: (event: any) => {
          if (event instanceof HttpResponse && !this.production) {
            this.loggerService.info('🟢 RESPONSE');
            this.loggerService.info('Status:', event.status);
            this.loggerService.info('URL:', event.url);
            this.loggerService.info('Body:', event.body);
            this.loggerService.info(
              '==================================================================='
            );
          }
        },
        error: (error: any) => {
          if (!this.production && error.status != 401) {
            this.loggerService.info('🔴 ERROR RESPONSE');
            if (error instanceof HttpErrorResponse) {
              this.loggerService.info('Status:', error.status);
              this.loggerService.info('URL:', error.url);
              this.loggerService.info('Message:', error.message);
              this.loggerService.info('Error:', error.error);
            } else {
              this.loggerService.info(error);
            }
            this.loggerService.info('========================');
          }
        },
      })
    );
  }
}
