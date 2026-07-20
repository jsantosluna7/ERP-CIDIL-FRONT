import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; //Libreria para decodificar JWT, si es necesario
import { JwtPayload } from '../../../interfaces/jwt-payload';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  public userSubject = new BehaviorSubject<any | null>(null);
  user$ = this.userSubject.asObservable();
  private sesionTimer: any;

  constructor(private http: HttpClient, private _router: Router) {
    const token = localStorage.getItem('token');

    if (token) {
      const decodificado: JwtPayload = jwtDecode(token);

      if (decodificado.exp && Date.now() >= decodificado.exp * 1000) {
        this.cerrarSesion();
      } else {
        this.userSubject.next(decodificado);

        if (decodificado.exp) {
          this.setAutoLogout(decodificado.exp);
        }
      }
    }
  }

  private setAutoLogout(exp: number) {
    const expDate = exp * 1000;
    const timeout = expDate - Date.now();

    if (this.sesionTimer) {
      clearTimeout(this.sesionTimer);
    }

    this.sesionTimer = setTimeout(() => {
      this.cerrarSesion();
      this._router.navigate(['/acceso/login']);
    }, timeout);
  }

  iniciarSesion(endpoint: string, body: any): Observable<any> {
    return this.http.post(endpoint, body).pipe(
      tap({
        next: (user: any) => {
          const token = user.tokenId;
          const tokenDecodificado: JwtPayload = jwtDecode(token);

          this.userSubject.next(tokenDecodificado);
          localStorage.setItem('token', token);

          //Iniciamos el timer del auto-logout

          if (tokenDecodificado.exp) {
            this.setAutoLogout(tokenDecodificado.exp);
          }
        },
      })
    );
  }

  cerrarSesion() {
    this.userSubject.next(null);
    localStorage.removeItem('token');
    localStorage.removeItem('tokenRegistro');
    if (this.sesionTimer) {
      clearTimeout(this.sesionTimer);
    }
  }

  registro(endpoint: string, body: any): Observable<any> {
    return this.http.post(endpoint, body).pipe(
      tap({
        next: (user: any) => {
          const token = user.tokenId;
          const tokenDecodificado: JwtPayload = jwtDecode(token);

          this.userSubject.next(tokenDecodificado);
          localStorage.setItem('tokenRegistro', token);

          if (tokenDecodificado.exp) {
            this.setAutoLogout(tokenDecodificado.exp);
          }
        },
      })
    );
  }

  usuarioPendiente(endpoint: string, body: any): Observable<any> {
    return this.http.post(endpoint, body).pipe(
      tap({
        next: (user: any) => {
          const token = user.tokenId;
          const tokenDecodificado: JwtPayload = jwtDecode(token);

          this.userSubject.next(tokenDecodificado);
          localStorage.setItem('token', token);

          if (tokenDecodificado.exp) {
            this.setAutoLogout(tokenDecodificado.exp);
          }
        },
      })
    );
  }

  olvideContrasena(endpoint: string, body: any): Observable<any> {
    return this.http.post(endpoint, body);
  }

  restablecerContrasena(endpoint: string, body: any): Observable<any> {
    return this.http.post(endpoint, body);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const tokenDecodificado: JwtPayload = jwtDecode<JwtPayload>(token);

      //verificar si ya el token expiro
      if (tokenDecodificado.exp && Date.now() >= tokenDecodificado.exp * 1000) {
        this.cerrarSesion();
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  isAuthenticatedOtp(): boolean {
    const tokenOtp = localStorage.getItem('tokenRegistro');
    if (!tokenOtp) return false;

    try {
      const tokenDecodificado: JwtPayload = jwtDecode<JwtPayload>(tokenOtp);

      //verificar si ya el token expiro
      if (tokenDecodificado.exp && Date.now() >= tokenDecodificado.exp * 1000) {
        this.cerrarSesion();
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }
}
