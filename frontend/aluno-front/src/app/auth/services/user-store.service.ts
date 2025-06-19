import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Usuario } from '../../models/usuario';
import { JwtPayload } from '../jwtpayload';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  setUsuarioFromToken(token: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const usuario: Usuario = {
        id: decoded.sub,
        nome: decoded.nome,
        isAdmin: decoded.admin,
        email: decoded.email,
      };
      this.usuarioSubject.next(usuario);
      localStorage.setItem('token', token);
    } catch (e) {
      this.clear();
    }
  }

  clear() {
    localStorage.removeItem('token');
    this.usuarioSubject.next(null);
  }

  getUsuario(): Usuario | null {
    return this.usuarioSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
