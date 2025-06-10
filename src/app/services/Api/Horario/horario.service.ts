import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  constructor(private http: HttpClient) { }

  getHorario(endpoint: string): Observable<any>{
    return this.http.get(endpoint);
  }

  getLaboratorio(endpoint: string, id: string): Observable<any>{
    return this.http.get(`${endpoint}/${id}`);
  }

  getAllLaboratorio(endpoint: string): Observable<any>{
    return this.http.get(endpoint);
  }

  postHorario(endpoint: string, body: any): Observable<any>{
    return this.http.post(endpoint, body);
  }

  putHorario(endpoint: string, body: any): Observable<any>{
    return this.http.put(endpoint, body);
  }

  deleteHorario(endpoint: string, id: string): Observable<any>{
    return this.http.delete(`${endpoint}/${id}`);
  }

  deleteHorarioAuto(endpoint: string, elimnar: string): Observable<any>{
    return this.http.delete(`${endpoint}?eliminar=${elimnar}`);
  }
}
