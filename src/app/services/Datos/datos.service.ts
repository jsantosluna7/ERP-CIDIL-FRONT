import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DatosService {

  private jsonDataSubject = new BehaviorSubject<any>(null);
  jsonData$ = this.jsonDataSubject.asObservable();

  obtenerData(data: any){
    this.jsonDataSubject.next(data);
  }
}
