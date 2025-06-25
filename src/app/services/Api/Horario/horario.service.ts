import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { UtilitiesService } from '../../Utilities/utilities.service';

@Injectable({
  providedIn: 'root',
})
export class HorarioService {
  hoyFormateado: string | null;

  constructor(
    private http: HttpClient,
    private _utilities: UtilitiesService,
    private _date: DatePipe
  ) {
    this.hoyFormateado = this._date.transform(new Date(), 'dd/MM/yyyy hh:mm a');
  }

  getHorario(
    endpoint: string,
    pagina: number = 1,
    tamanoPagina: number = 20
  ): Observable<any> {
    return this.http.get(
      `${endpoint}?pagina=${pagina}&tamanoPagina=${tamanoPagina}`
    );
  }

  getHorarioCalendario(endpoint: string, params?: any): Observable<any> {
    return this.http.get(endpoint, params);
  }

  getIdLaboratorio(endpoint: string, codigo: string): Observable<any> {
    return this.http.get(`${endpoint}?codigo=${codigo}`);
  }

  getAllLaboratorio(endpoint: string): Observable<any> {
    return this.http.get(endpoint);
  }

  postHorario(endpoint: string, body: any): Observable<any> {
    return this.http.post(endpoint, body);
  }

  putHorario(endpoint: string, id: string, body: any): Observable<any> {
    return this.http.put(`${endpoint}/${id}`, body);
  }

  deleteHorario(endpoint: string, id: string): Observable<any> {
    return this.http.delete(`${endpoint}/${id}`);
  }

  deleteHorarioAuto(endpoint: string): Observable<any> {
    return this.http.delete(`${endpoint}?eliminar=true`);
  }
}
