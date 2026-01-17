import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImportarPdfRespuesta } from '../../interfaces/importarPdfRespuesta';

@Injectable({
  providedIn: 'root',
})
export class ComprasService {
  urlPrincipal: string = `${process.env['API_URL']}${process.env['ENDPOINT_ESPECIALIZADO']}`;
  urlPrincipalItems: string = `${process.env['API_URL']}${process.env['ENDPOINT_ESPECIALIZADO_ITEMS']}`;
  urlItemsOrden: string = `${process.env['ENDPOINT_ESPECIALIZADO_ITEMS_ORDEN']}`;
  urlActualizarOrden: string = `${process.env['ENDPOINT_ACTUALIZAR_ESTADO_ORDEN']}`;
  urlActualizarItem: string = `${process.env['ENDPOINT_ACTUALIZAR_RECEPCION']}`;

  constructor(private http: HttpClient) {}

  obtenerOrdenes(url: string): Observable<any[]> {
    return this.http.get<any[]>(url);
  }

  buscarOrdenes(
    url: string,
    termino: string,
    filtro: string
  ): Observable<any[]> {
    return this.http.get<any[]>(`${url}?termino=${termino}&filtro=${filtro}`);
  }

  actualizarEstadoOrden(id: number, body: any): Observable<any> {
    return this.http.post(
      `${this.urlPrincipal}${id}${this.urlActualizarOrden}`,
      body
    );
  }

  actualizarEstadoItem(id: number, body: any): Observable<any> {
    return this.http.post(
      `${this.urlPrincipalItems}${id}${this.urlActualizarItem}`,
      body
    );
  }

  importarPdf(
    url: string,
    file: File,
    idUsuario: number
  ): Observable<ImportarPdfRespuesta> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('usuarioId', idUsuario.toString());

    return this.http.post<ImportarPdfRespuesta>(url, formData);
  }
}
