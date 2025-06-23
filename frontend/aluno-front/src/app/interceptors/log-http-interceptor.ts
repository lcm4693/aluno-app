import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class LogHTTP implements HttpInterceptor {
  constructor() {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('URL:', req.urlWithParams);
    console.log('Método:', req.method);
    console.log('Body:', req.body);
    console.log('Headers:', req.headers);
    return next.handle(req);
  }
}
