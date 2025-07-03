import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { UserStoreService } from '../services/user-store.service';
import { LoggerService } from '../../services/logger.service';
import { TokenRefreshService } from '../../services/token-refresh.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private userStore: UserStoreService,
    private loggerService: LoggerService,
    private tokenRefreshService: TokenRefreshService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.userStore.getToken();

    // Para o interceptador funcionar com o proxy, é necessário uma barra no fim da URL,
    //porém nã podemos usar isso para imagens e outros recursos.
    const shouldAppendSlash =
      req.method === 'GET' &&
      !req.url.endsWith('/') &&
      !req.url.includes('.') && // evita imagens, .pdf etc.
      !req.url.includes('?');

    const url = shouldAppendSlash ? req.url + '/' : req.url;

    // ❗ Ignorar a rota de refresh para evitar loop infinito
    const isRefreshRequest = req.url.includes('/auth/refresh');
    if (isRefreshRequest) {
      return next.handle(req);
    }

    const authReq = req.clone({
      url,
      setHeaders: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    });

    return next.handle(authReq).pipe(
      catchError((error) => {
        this.loggerService.debug(
          '[AuthInterceptor] erro detectado: ' + error.status
        );

        if (
          error instanceof HttpErrorResponse &&
          (error.status === 401 || error.status === 403) &&
          this.userStore.getToken()
        ) {
          return this.tokenRefreshService.handle401Erro(authReq, next);
        }
        return throwError(() => error);
      })
    );
  }
}
