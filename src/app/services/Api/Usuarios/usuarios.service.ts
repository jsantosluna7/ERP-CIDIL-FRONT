import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  public userSubject = new BehaviorSubject<any | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('user');
    if (stored) this.userSubject.next(JSON.parse(stored));
  }

  iniciarSesion(endpoint: string, body: any): Observable<any> {
    return this.http.post(endpoint, body).pipe(
      tap({
        next: (user) => {
          this.userSubject.next(user);
          localStorage.setItem('user', JSON.stringify(user));
        },
      })
    );
  }

  cerrarSesion() {
    this.userSubject.next(null);
    localStorage.removeItem('user');
  }

  registro(endpoint: string, body: any): Observable<any> {
    return this.http.post(endpoint, body).pipe(
      tap({
        next: (user) => {
          this.userSubject.next(user);
          localStorage.setItem('user', JSON.stringify(user));
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
