import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Observable,
  of,
  tap,
} from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Usuario } from '../../models/usuario';
import { JwtPayload } from '../jwtpayload';
import { AuthService } from './auth.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  private refreshInProgress = false;

  constructor(private authService: AuthService) {}

  setUsuarioFromToken(accessToken: string, refreshToken: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(accessToken);
      const usuario: Usuario = {
        id: decoded.sub,
        nome: decoded.nome,
        admin: decoded.admin,
        email: decoded.email,
      };

      this.usuarioSubject.next(usuario);
      localStorage.setItem('token-aluno-app', accessToken);
      localStorage.setItem('refresh-aluno-app', refreshToken);
    } catch (e) {
      this.clear();
    }
  }

  clear() {
    localStorage.removeItem('token-aluno-app');
    localStorage.removeItem('refresh-aluno-app');
    this.usuarioSubject.next(null);
  }

  getUsuario(): Usuario | null {
    return this.usuarioSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token-aluno-app');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh-aluno-app');
  }

  refreshAccessToken(): Observable<boolean> {
    if (this.refreshInProgress) {
      return of(false); // ou aguardar a conclusão usando Subject
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return of(false);
    }

    return this.authService.refreshToken(refreshToken).pipe(
      tap((res: any) => {
        // localStorage.setItem('token-aluno-app', res.access_token);
        this.setUsuarioFromToken(res.access_token, refreshToken);
      }),
      map(() => true),
      catchError((err) => {
        this.clear();
        return of(false);
      }),
      finalize(() => {
        this.refreshInProgress = false;
      })
    );
  }
}
