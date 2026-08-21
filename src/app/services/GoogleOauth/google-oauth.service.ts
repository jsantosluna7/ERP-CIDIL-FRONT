/// <reference types="google.accounts" />

import { Injectable, NgZone } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ACESFilmicToneMapping } from 'three';

const GOOGLE_CLIENT_ID = environment.googleClientId;

@Injectable({
  providedIn: 'root',
})
export class GoogleOauthService {
  private tokenClient: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone,
  ) {}

  private esperarGoogle(intentos = 20): Promise<void> {
    return new Promise((resolve, reject) => {
      const check = () => {
        if (typeof google !== 'undefined' && google.accounts?.oauth2) {
          resolve();
        } else if (intentos <= 0) {
          reject('Google script no cargó a tiempo');
        } else {
          setTimeout(
            () => this.esperarGoogle(--intentos).then(resolve, reject),
            200,
          );
        }
      };
      check();
    });
  }

  async initTokenClient() {
    await this.esperarGoogle();

    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'openid email profile',
      callback: (response: any) => this.handleTokenResponse(response),
    });
  }

  loginConGoogle() {
    if (!this.tokenClient) {
      console.error(
        'Token client no inicializado. Llamá a initTokenClient() primero.',
      );
      return;
    }
    this.tokenClient.requestAccessToken();
  }

  private async handleTokenResponse(response: any) {
    if (response.error) {
      console.error('Error de login:', response.error);
      return;
    }

    const accessToken = response.access_token;

    console.log('token', accessToken);

    // Enviás el access_token a tu backend, y el backend
    // lo valida contra Google y obtiene los datos del usuario
    // const res: any = await firstValueFrom(
    //   this.http.post('https://tu-api.com/api/auth/google', { accessToken }),
    // );

    // this.ngZone.run(() => {
    //   if (res.exists) {
    //     localStorage.setItem('token', res.token);
    //     this.router.navigate(['/dashboard']);
    //   } else {
    //     this.router.navigate(['/completar-registro'], {
    //       state: {
    //         accessToken,
    //         email: res.email,
    //         nombre: res.nombre,
    //         foto: res.foto,
    //       },
    //     });
    //   }
    // });
  }
}
