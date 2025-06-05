import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Laboratorio } from '../../interfaces/laboratorio.interface';


@Injectable({
  providedIn: 'root'
})
export class LaboratorioService {
  private apiUrl = `${process.env['API_URL']}${process.env['ENDPOINT_LABORATORIO']}`;

  constructor(private http: HttpClient) {}

  getLaboratorios(): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(this.apiUrl);
  }

  getLaboratorioPorId(id: number): Observable<Laboratorio> {
    return this.http.get<Laboratorio>(`${this.apiUrl}/${id}`);
  }

  agregarLaboratorio(data: Laboratorio): Observable<Laboratorio> {
    return this.http.post<Laboratorio>(this.apiUrl, data);
  }

  actualizarLaboratorio(id: number, data: Laboratorio): Observable<Laboratorio> {
    return this.http.put<Laboratorio>(`${this.apiUrl}/${id}`, data);
  }

  eliminarLaboratorio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
