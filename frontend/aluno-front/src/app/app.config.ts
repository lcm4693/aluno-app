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
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import Lara from '@primeng/themes/lara';
import Material from '@primeng/themes/material';
import Nora from '@primeng/themes/nora';
import { MyPreset } from './theme/custom-theme-preset';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    AuthInterceptor,
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
      },
      ripple: true,
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: LOCALE_ID, useValue: 'pt-BR' },

    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ), // 👈 essa linha garante que o scroll volta pro topo),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
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
