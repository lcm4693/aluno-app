import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class ErrosHttp implements HttpInterceptor {
  constructor(
    private toastService: ToastService,
    private router: Router,
    private loggerService: LoggerService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        const codigoErro = err.status;

        if (codigoErro == 0) {
          this.loggerService.error('Erro de rede');
          this.toastService.error(
            'Erro de conexão',
            'Não foi possível se conectar ao servidor'
          );
        } else {
          switch (codigoErro) {
            case 401:
              break;
            case 403:
              this.toastService.error(
                'Acesso negado',
                'Você não tem permissão para essa ação'
              );
              break;
            case 404:
              this.loggerService.error('Recurso solicitado não foi localizado');
              this.toastService.error('Recurso solicitado não foi localizado');
              break;
            case 500:
              this.loggerService.error('Erro no servidor');
              this.toastService.error(
                'Erro interno. Tente novamente mais tarde'
              );
              break;
            default:
              this.loggerService.error('Erro ' + codigoErro);
              this.toastService.error('Erro não identificado:' + err.message);
              break;
          }
        }
        if (codigoErro != 401) {
          this.loggerService.error('Erro HTTP:', err);
        }
        return throwError(() => err);
      })
    );
  }
}
