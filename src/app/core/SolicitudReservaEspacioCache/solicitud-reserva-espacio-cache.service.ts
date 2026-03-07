import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudReservaEspacioCacheService {

  private apiUrl = `${process.env['API_URL']}${process.env['ENDPOINT_RESERVA_ESPACIO']}`;

  private cache = new Map<string, Observable<any>>();

  constructor(private http: HttpClient) {}

  // TODAS LAS SOLICITUDES
  obtenerSolicitudes(): Observable<any[]> {

    const url = `${this.apiUrl}/obtener-solicitudes-reservas`;

    if (!this.cache.has(url)) {
      const request$ = this.http.get<any[]>(url).pipe(
        shareReplay(1)
      );
      this.cache.set(url, request$);
    }

    return this.cache.get(url)!;
  }

  // SOLICITUDES POR PISO
  obtenerSolicitudesPorPiso(piso: number): Observable<any[]> {

    const url = `${this.apiUrl}/obtener-solicitudes-reservas-piso/${piso}`;

    if (!this.cache.has(url)) {
      const request$ = this.http.get<any[]>(url).pipe(
        shareReplay(1)
      );
      this.cache.set(url, request$);
    }

    return this.cache.get(url)!;
  }

  // SOLICITUD POR ID
  obtenerSolicitudPorId(id: number): Observable<any> {

    const url = `${this.apiUrl}/obtener-solicitudes-reservas/${id}`;

    if (!this.cache.has(url)) {
      const request$ = this.http.get<any>(url).pipe(
        shareReplay(1)
      );
      this.cache.set(url, request$);
    }

    return this.cache.get(url)!;
  }

  // MIS SOLICITUDES
  obtenerMisSolicitudes(): Observable<any[]> {

    const url = `${this.apiUrl}/mis-solicitudes-espacios`;

    if (!this.cache.has(url)) {
      const request$ = this.http.get<any[]>(url).pipe(
        shareReplay(1)
      );
      this.cache.set(url, request$);
    }

    return this.cache.get(url)!;
  }

  // CREAR SOLICITUD
  crearSolicitud(data: any): Observable<any> {
    this.limpiarCache();
    return this.http.post(`${this.apiUrl}/crear-solicitud-reserva`, data);
  }

  // EDITAR SOLICITUD
  editarSolicitud(id: number, data: any): Observable<any> {
    this.limpiarCache();
    return this.http.put(`${this.apiUrl}/editar-solicitud-reserva/${id}`, data);
  }

  // CANCELAR SOLICITUD
  cancelarSolicitud(id: number): Observable<any> {
    this.limpiarCache();
    return this.http.delete(`${this.apiUrl}/cancelar-solicitud-reserva/${id}`);
  }

  // LIMPIAR CACHE
  limpiarCache() {
    this.cache.clear();
  }

}