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

    if(token){
      const decodificado: JwtPayload = jwtDecode(token);
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
  }

  registro(endpoint: string, body: any): Observable<any> {
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

  usuarioPendiente(endpoint: string, body: any): Observable<any> {
    return this.http.post(endpoint, body);
    // .pipe(
    //   tap({
    //     next: (user) => {
    //       this.userPendienteSubject.next(user);
    //     },
    //   })
    // );
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
