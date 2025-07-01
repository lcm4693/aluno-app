import {
  ApplicationConfig,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { AuthInterceptor } from './auth/interceptors/auth.interceptor';
import { ErrosHttp } from './interceptors/erros-http.interceptor';
import { LogHTTP } from './interceptors/log-http-interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { LOCALE_ID } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    AuthInterceptor,
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: LOCALE_ID, useValue: 'pt-BR' },

    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ), // 👈 essa linha garante que o scroll volta pro topo),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LogHTTP,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrosHttp,
      multi: true,
    },
  ],
};
