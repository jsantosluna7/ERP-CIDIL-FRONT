import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(private http: HttpClient) { }

  getRol(endpoint: string, id: string): Observable<any>{
    return this.http.get(`${endpoint}/${id}`);
  }
}
