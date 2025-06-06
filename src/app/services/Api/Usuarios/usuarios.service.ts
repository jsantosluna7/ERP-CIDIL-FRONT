import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }

  iniciarSesion(endpoint: string, body: any): Observable<any>{
    return this.http.post(endpoint, body);
  }
  
  registro(endpoint: string, body: any): Observable<any>{
    return this.http.post(endpoint, body);
  }

  olvideContrasena(endpoint: string, body: any): Observable<any>{
    return this.http.post(endpoint, body);
  }

  restablecerContrasena(endpoint: string, body: any): Observable<any>{
    return this.http.post(endpoint, body);
  }
}
