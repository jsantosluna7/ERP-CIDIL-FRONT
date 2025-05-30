import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class DatosService {

  private jsonDataSubject = new BehaviorSubject<any[]>([]);
  jsonData$ = this.jsonDataSubject.asObservable();

  obtenerData(data: any[]){
    this.jsonDataSubject.next(data);
  }
}
