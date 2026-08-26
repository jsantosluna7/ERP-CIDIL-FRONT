/// <reference types="google.accounts" />

import { Injectable, NgZone } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ACESFilmicToneMapping } from 'three';
import { GoogleOauthStateService } from './google-oauth-state.service';
import { ToastrService } from 'ngx-toastr';
import { UsuariosService } from '../Api/Usuarios/usuarios.service';

const GOOGLE_CLIENT_ID = environment.googleClientId;

@Injectable({
  providedIn: 'root',
})
export class GoogleOauthService {
  private tokenClient: any;
  endpoint: string = `${process.env['API_URL']}${process.env['ENDPOINT_LOGIN_GOOGLE']}`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone,
    private _authState: GoogleOauthStateService,
    private _toastr: ToastrService,
    private _usuario: UsuariosService
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

    try {
      const res: any = await firstValueFrom(
        this.http.post(this.endpoint, { accessToken }),
      );

      this.ngZone.run(() => {
        if (res.existe) {
          this._usuario.establecerSesionDesdeToken(res.token.tokenId);
          this.router.navigate(['home']);
        } else {
          // Guardamos el accessToken en memoria, no en el Router state ni en storage
          this._authState.setEstado(accessToken, {
            email: res.correoInstitucional,
            nombre: res.nombreUsuario,
            apellido: res.apellidoUsuario,
            foto: res.fotoPerfil,
          });
          this.router.navigate(['acceso/registrar-google']);
        }
      });
    } catch (err: any) {
      console.error(err)
      this._toastr.error(err.error.mensaje, 'Error');
    }
  }
}
