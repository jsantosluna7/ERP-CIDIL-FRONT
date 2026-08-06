import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { Laboratorio, SolicitudReserva } from '../../interfaces/laboratorio.interface';

@Injectable({
  providedIn: 'root'
})
export class LaboratorioCacheService {

  private apiUrl = `${process.env['API_URL']}${process.env['ENDPOINT_LABORATORIO']}`;
  private apiUrlSolicitud = `${process.env['API_URL']}${process.env['ENDPOINT_RESERVA']}`;

  private cache = new Map<string, Observable<any>>();

  constructor(private http: HttpClient) {}

  getLaboratorios(): Observable<Laboratorio[]> {

    const key = 'laboratorios';

    if (!this.cache.has(key)) {
      const request$ = this.http.get<Laboratorio[]>(this.apiUrl)
        .pipe(shareReplay(1));

      this.cache.set(key, request$);
    }

    return this.cache.get(key)!;
  }

  getLaboratorioPorId(id: number): Observable<Laboratorio> {

    const key = `laboratorio-${id}`;

    if (!this.cache.has(key)) {
      const request$ = this.http.get<Laboratorio>(`${this.apiUrl}/${id}`)
        .pipe(shareReplay(1));

      this.cache.set(key, request$);
    }

    return this.cache.get(key)!;
  }

  agregarLaboratorio(data: Laboratorio): Observable<Laboratorio> {
    this.limpiarCache();
    return this.http.post<Laboratorio>(this.apiUrl, data);
  }

  actualizarLaboratorio(id: number, data: Laboratorio): Observable<Laboratorio> {
    this.limpiarCache();
    return this.http.put<Laboratorio>(`${this.apiUrl}/${id}`, data);
  }

  enviarSolicitud(solicitud: SolicitudReserva): Observable<any> {
    return this.http.post(`${this.apiUrlSolicitud}`, solicitud);
  }

  eliminarLaboratorio(id: number): Observable<void> {
    this.limpiarCache();
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  limpiarCache() {
    this.cache.clear();
  }

}