import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStoreService } from '../services/user-store.service';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../jwtpayload';

export const authGuard: CanActivateFn = (route, state) => {
  const userStore = inject(UserStoreService);
  const router = inject(Router);

  const token = userStore.getToken();

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const expired = decoded.exp * 1000 < Date.now();

    if (expired) {
      userStore.clear();
      router.navigate(['/login']);
      return false;
    }
  } catch (e) {
    // Token malformado ou inválido
    userStore.clear();
    router.navigate(['/login']);
    return false;
  }

  // Token válido e não expirado
  if (userStore.getUsuario()) {
    return true;
  }

  // Token válido, mas store não foi preenchida ainda
  userStore.setUsuarioFromToken(token);

  return true;
};
