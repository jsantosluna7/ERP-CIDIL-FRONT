import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LaboratorioService {

  constructor(private http: HttpClient) { }

  getLabs(endpoint: string): Observable<any>{
    return this.http.get(endpoint);
  }

  getLabById(endpoint: string, id: string): Observable<any>{
    return this.http.get(`${endpoint}/${id}`);
  }
}
