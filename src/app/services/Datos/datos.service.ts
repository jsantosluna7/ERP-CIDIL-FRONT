import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class DatosService {

  private jsonDataSubject = new BehaviorSubject<any[]>([]);
  jsonData$ = this.jsonDataSubject.asObservable();

  private fechaDataSubject = new BehaviorSubject<any[]>([]);
  fechaData$ = this.fechaDataSubject.asObservable();

  obtenerData(data: any[]){
    this.jsonDataSubject.next(data);
  }

  obtenerFecha(fecha: any){
    this.fechaDataSubject.next(fecha);
  }

  excelTiempoAString(excelSerial: number): string{
    const horasTotales = excelSerial * 24;
    const horas = Math.floor(horasTotales);
    const minutos = Math.round((horasTotales - horas) * 60);
    const hh = horas.toString().padStart(2, '0');
    const mm = minutos.toString().padStart(2, '0');
    return `${hh}:${mm}`
  }
}
