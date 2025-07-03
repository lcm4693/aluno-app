import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  of,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { UserStoreService } from '../auth/services/user-store.service';
import { ToastService } from './toast.service';
import { Router } from '@angular/router';
import { LoggerService } from './logger.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TokenRefreshService {
  private readonly production: Boolean = environment.production as Boolean;

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  private toastShown = false;

  constructor(
    private userStore: UserStoreService,
    private toastService: ToastService,
    private router: Router,
    private loggerService: LoggerService
  ) {}

  public handle401Erro(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.isRefreshing) {
      return this.waitForTokenAndRetry(req, next);
    }

    return this.refreshAndRetry(req, next);
  }

  private refreshAndRetry(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.userStore.refreshAccessToken().pipe(
      switchMap((success) => {
        this.isRefreshing = false;
        if (!success) {
          return this.handleRefreshFailure();
        }
        const newToken = this.userStore.getToken();
        this.refreshTokenSubject.next(newToken);
        if (!this.production) {
          this.loggerService.debug('[TokenRefresh] Token renovado com sucesso');
          this.toastService.success('Token renovado');
        }

        return next.handle(this.cloneRequestWithToken(req, newToken!));
      }),
      catchError((err) => {
        this.loggerService.debug('[TokenRefresh] Erro ao renovar token');
        this.isRefreshing = false;

        return this.handleRefreshFailure(err);
      })
    );
  }

  private handleRefreshFailure(err?: any): Observable<never> {
    this.userStore.clear();
    if (!this.toastShown) {
      this.toastService.error('Sessão expirada', 'Refaça o login');
      this.toastShown = true;
    }
    this.router.navigate(['/login']);
    return throwError(() => err || new Error('Refresh token inválido'));
  }

  public waitForTokenAndRetry(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.refreshTokenSubject.pipe(
      filter((token): token is string => !!token),
      take(1),
      switchMap((token) => {
        this.loggerService.debug('[TokenRefresh] Esperando token para retry');
        return next.handle(this.cloneRequestWithToken(req, token));
      })
    );
  }

  private cloneRequestWithToken(
    req: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {
    return req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  // public handle401Error(
  //   req: HttpRequest<any>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<any>> {
  //   if (!this.isRefreshing) {
  //     this.isRefreshing = true;
  //     this.refreshTokenSubject.next(null);
  //     // this.loadingService.show(); // loading para a renovação

  //     return this.userStore.refreshAccessToken().pipe(
  //       switchMap((success) => {
  //         this.loggerService.info('[TokenRefreshService] switch map');

  //         this.isRefreshing = false;
  //         // this.loadingService.hide();

  //         if (!success) {
  //           this.loggerService.info(
  //             '[TokenRefreshService] Falhour a renovação. Redorecionando'
  //           );
  //           this.userStore.clear();
  //           if (!this.toastShown) {
  //             this.toastService.error('Sessão expirada', 'Refaça o login');
  //             this.toastShown = true;
  //           }
  //           this.router.navigate(['/login']);
  //           return throwError(() => new Error('Refresh token inválido'));
  //         }

  //         const newToken = this.userStore.getToken();
  //         this.refreshTokenSubject.next(newToken);

  //         this.loggerService.info(
  //           '[TokenRefreshService] Token renovado com sucesso. Retrying request com novo token'
  //         );
  //         // Reenvia a requisição original com o novo token
  //         return next.handle(
  //           req.clone({
  //             setHeaders: { Authorization: `Bearer ${newToken}` },
  //           })
  //         );
  //       }),
  //       catchError((err) => {
  //         this.loggerService.info(
  //           '[TokenRefreshService] catchError interno. Falha no refresh'
  //         );
  //         this.isRefreshing = false;
  //         this.loadingService.hide();
  //         this.userStore.clear();
  //         if (!this.toastShown) {
  //           this.toastService.error('Sessão expirada', 'Refaça o login');
  //           this.toastShown = true;
  //         }
  //         this.router.navigate(['/login']);
  //         return throwError(() => err);
  //       })
  //     );
  //   } else {
  //     // Enquanto estiver renovando o token, espera a renovação terminar
  //     return this.refreshTokenSubject.pipe(
  //       filter((token): token is string => !!token),
  //       take(1),
  //       switchMap((token) =>
  //         next.handle(
  //           req.clone({
  //             setHeaders: { Authorization: `Bearer ${token}` },
  //           })
  //         )
  //       )
  //     );
  //   }
  // }
}
