import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; //Libreria para decodificar JWT, si es necesario
import { JwtPayload } from '../../../interfaces/jwt-payload';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  public userSubject = new BehaviorSubject<any | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    const tokenRegistro = localStorage.getItem('tokenRegistro');

    if (token) {
      const decodificado: JwtPayload = jwtDecode(token);
      this.userSubject.next(decodificado);
    }

    if (tokenRegistro) {
      const decodificado: JwtPayload = jwtDecode(tokenRegistro);
      this.userSubject.next(decodificado);
    }
  }

  iniciarSesion(endpoint: string, body: any): Observable<any> {
    return this.http.post(endpoint, body).pipe(
      tap({
        next: (user: any) => {
          const token = user.tokenId;
          const tokenDecodificado: JwtPayload = jwtDecode(token);

          this.userSubject.next(tokenDecodificado);
          localStorage.setItem('token', token);
        },
      })
    );
  }

  cerrarSesion() {
    this.userSubject.next(null);
    localStorage.removeItem('token');
    localStorage.removeItem('tokenRegistro');
  }

  registro(endpoint: string, body: any): Observable<any> {
    return this.http.post(endpoint, body).pipe(
      tap({
        next: (user: any) => {
          const token = user.tokenId;
          const tokenDecodificado: JwtPayload = jwtDecode(token);

          this.userSubject.next(tokenDecodificado);
          localStorage.setItem('tokenRegistro', token);
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
    return !!this.userSubject.value;
  }
}
