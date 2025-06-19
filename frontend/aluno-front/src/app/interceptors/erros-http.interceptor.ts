import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

@Injectable()
export class ErrosHttp implements HttpInterceptor {
  constructor(private toastService: ToastService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        const codigoErro = err.status;
        if (codigoErro == 0) {
          console.log('Erro de rede');
          this.toastService.error(
            'Erro de conexão',
            'Não foi possível se conectar ao servidor'
          );
        } else {
          switch (codigoErro) {
            case 403:
              console.log('Recurso solicitado não foi autorizado');
              this.toastService.error(
                'Acesso negado',
                'Você não tem permissão para essa ação'
              );
              break;
            case 404:
              console.log('Recurso solicitado não foi localizado');
              this.toastService.error('Recurso solicitado não foi localizado');
              break;
            case 500:
              console.log('Erro no servidor');
              this.toastService.error(
                'Erro interno. Tente novamente mais tarde'
              );
              break;
            default:
              console.log('Erro ' + codigoErro);
              this.toastService.error(err.message);
              break;
          }
        }
        console.error('Erro HTTP:', err);
        return throwError(() => err);
      })
    );
  }
}
