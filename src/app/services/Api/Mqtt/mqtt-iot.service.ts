import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MqttIOTService {
  constructor(private http: HttpClient) {}

  // getIot(endpoint: string): Observable<any> {
  //   return this.http.get(endpoint);
  // }

  getIot(endpoint: string, pagina: number = 1, tamanoPagina: number = 20) {
    return this.http.get(
      `${endpoint}?pagina=${pagina}&tamanoPagina=${tamanoPagina}`
    );
  }

  filtradoIot(
    endpoint: string,
    pagina: string,
    tamanoPagina: string,
    inicio: any,
    fin: any
  ): Observable<any> {
    return this.http.get(endpoint, {
      params: {
        pagina: pagina,
        tamanoPagina: tamanoPagina,
        inicio: inicio,
        fin: fin,
      },
    });
  }

  deleteIot(endpoint: string, id: string): Observable<any> {
    return this.http.patch(`${endpoint}/${id}`, null);
  }
}
