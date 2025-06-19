import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStoreService } from '../services/user-store.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userStore: UserStoreService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.userStore.getToken();

    if (!token) {
      return next.handle(req);
    }

    // Para o interceptador funcionar com o proxy, é necessário uma barra no fim da URL,
    //porém nã podemos usar isso para imagens e outros recursos.
    const shouldAppendSlash =
      req.method === 'GET' &&
      !req.url.endsWith('/') &&
      !req.url.includes('.') && // evita imagens, .pdf etc.
      !req.url.includes('?');

    const url = shouldAppendSlash ? req.url + '/' : req.url;

    const authReq = req.clone({
      url,
      setHeaders: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    });

    return next.handle(authReq);
  }
}
