import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImportarPdfRespuesta } from '../../interfaces/importarPdfRespuesta';

@Injectable({
  providedIn: 'root',
})
export class ComprasService {
  constructor(private http: HttpClient) {}

  obtenerOrdenes(url: string): Observable<any[]> {
    return this.http.get<any[]>(url);
  }

  obtenerEstadosTimelinePorId(url: string, id: number): Observable<any> {
    return this.http.get<any>(`${url}?id=${id}`);
  }

  importarPdf(
    url: string,
    file: File,
    idUsuario: number
  ): Observable<ImportarPdfRespuesta> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('idUsuario', idUsuario.toString());

    return this.http.post<ImportarPdfRespuesta>(url, formData);
  }

  cantidadOrdenes(url: string): Observable<number> {
    return this.http.get<number>(url);
  }
}
