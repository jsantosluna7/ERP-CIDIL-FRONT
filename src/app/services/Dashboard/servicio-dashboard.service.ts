import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioDashboardService {

  constructor(private http: HttpClient) { }

  getReservaPiso(endpoint: string, piso: number, params?: any): Observable<any>{
    return this.http.get(`${endpoint}/${piso}`, params);
  }

  getSolicitudReservaPiso(endpoint: string, piso: number): Observable<any>{
    return this.http.get(`${endpoint}/${piso}`);
  }
}
