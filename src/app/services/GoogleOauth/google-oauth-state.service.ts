import { Injectable } from '@angular/core';

interface GoogleUserData {
  email: string;
  nombre: string;
  apellido: string;
  foto: string;
}

@Injectable({
  providedIn: 'root',
})
export class GoogleOauthStateService {
  private accessToken: string | null = null;
  private userData: GoogleUserData | null = null;

  setEstado(accessToken: string, userData: GoogleUserData) {
    this.accessToken = accessToken;
    this.userData = userData;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getUserData(): GoogleUserData | null {
    return this.userData;
  }

  limpiar() {
    this.accessToken = null;
    this.userData = null;
  }
}
