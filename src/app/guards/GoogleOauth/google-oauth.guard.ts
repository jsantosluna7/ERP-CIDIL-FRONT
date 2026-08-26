import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GoogleOauthStateService } from '../../services/GoogleOauth/google-oauth-state.service';

export const googleOauthGuard: CanActivateFn = (route, state) => {
  const authState = inject(GoogleOauthStateService);
  const router = inject(Router);

  const datos = authState.getUserData();
  const token = authState.getAccessToken();

  if (!datos || !token) {
    router.navigate(['acceso/login'], { queryParams: { motivo: 'sesion_expirada' } });
    return false;
  }
  return true;
};
