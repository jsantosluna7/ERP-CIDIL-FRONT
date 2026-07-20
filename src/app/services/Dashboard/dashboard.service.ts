import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DashboardService {
  constructor(private http: HttpClient) {}

  getCantidadPrestamosEquipos(enpoint: string): Observable<any> {
    return this.http.get(enpoint);
  }

  getCantidadReservaEspacios(enpoint: string): Observable<any> {
    return this.http.get(enpoint);
  }

  getCantidadUsuarios(enpoint: string): Observable<any> {
    return this.http.get(enpoint);
  }
}
