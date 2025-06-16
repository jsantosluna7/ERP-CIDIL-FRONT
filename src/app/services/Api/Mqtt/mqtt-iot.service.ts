import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MqttIOTService {

  constructor(private http: HttpClient) { }

  getIot(endpoint: string): Observable<any>{
    return this.http.get(endpoint);
  }

  deleteIot(endpoint: string, id: string): Observable<any> {
    return this.http.delete(`${endpoint}/${id}`);
  }
}
