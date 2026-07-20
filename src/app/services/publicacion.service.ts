import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  private apiUrl = 'http://localhost:5006/api/Anuncio';

  constructor(private http: HttpClient) { }

  // Obtener todos los anuncios
  getAnuncios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/obtener`).pipe(
      catchError((error) => {
        console.error('Error al obtener anuncios:', error);
        return of([]);
      })
    );
  }

  // Obtener anuncios en carrusel
  getCarrusel(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/carrusel`).pipe(
      catchError((error) => {
        console.error('Error al obtener carrusel:', error);
        return of([]);
      })
    );
  }

  // Obtener pasantías
  getPasantias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pasantias`).pipe(
      catchError((error) => {
        console.error('Error al obtener pasantías:', error);
        return of([]);
      })
    );
  }
}
