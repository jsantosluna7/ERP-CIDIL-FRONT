import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarioService {
  constructor(private http: HttpClient) {}

  getReservas(endpoint: string, params?: any): Observable<any> {
    return this.http.get(endpoint, params);
  }

  getLaboratorio(endpoint: string, id: string): Observable<any> {
    return this.http.get(`${endpoint}/${id}`);
  }
  
  getEstado(endpoint: string, id: string): Observable<any> {
    return this.http.get(`${endpoint}/${id}`);
  }
}
