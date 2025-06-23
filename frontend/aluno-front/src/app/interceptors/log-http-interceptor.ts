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

@Injectable()
export class LogHTTP implements HttpInterceptor {
  constructor() {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (environment.logHttpRequests) {
      console.log('🔵 REQUEST');
      console.log('URL:', req.urlWithParams);
      console.log('Método:', req.method);
      if (req.body) console.log('Body:', req.body);
      console.log('Headers:', req.headers);
      console.log(
        '==================================================================='
      );
    }
    return next.handle(req).pipe(
      tap({
        next: (event: any) => {
          if (event instanceof HttpResponse && environment.logHttpRequests) {
            console.log('🟢 RESPONSE');
            console.log('Status:', event.status);
            console.log('URL:', event.url);
            console.log('Body:', event.body);
            console.log('========================');
          }
        },
        error: (error: any) => {
          if (environment.logHttpRequests) {
            console.error('🔴 ERROR RESPONSE');
            if (error instanceof HttpErrorResponse) {
              console.error('Status:', error.status);
              console.error('URL:', error.url);
              console.error('Message:', error.message);
              console.error('Error:', error.error);
            } else {
              console.error(error);
            }
            console.log('========================');
          }
        },
      })
    );
  }
}
