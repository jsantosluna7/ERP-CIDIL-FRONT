import { Injectable } from '@angular/core';
import { number } from 'echarts/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatosService {
  private jsonDataSubject = new BehaviorSubject<any[]>([]);
  jsonData$ = this.jsonDataSubject.asObservable();

  private fechaDataSubject = new BehaviorSubject<any[]>([]);
  fechaData$ = this.fechaDataSubject.asObservable();

  private comentarioSubject = new BehaviorSubject<any[]>([]);
  comentario$ = this.comentarioSubject.asObservable();

  private timerDataSubject = new BehaviorSubject<any[]>([]);
  timerData$ = this.timerDataSubject.asObservable();

  obtenerData(data: any[]) {
    this.jsonDataSubject.next(data);
  }

  obtenerFecha(fecha: any) {
    this.fechaDataSubject.next(fecha);
  }
  obtenerComentario(comentario: any) {
    this.comentarioSubject.next(comentario);
  }

  timerFecha(timer: any) {
    this.timerDataSubject.next(timer);
  }

  excelTiempoAString(excelSerial: number): string {
    const horasTotales = excelSerial * 24;
    const horas = Math.floor(horasTotales);
    const minutos = Math.round((horasTotales - horas) * 60);

    // Corrección: si minutos redondea a 60, subimos la hora
    const horasFinal = minutos === 60 ? horas + 1 : horas;
    const minutosFinal = minutos === 60 ? 0 : minutos;

    const hh = horasFinal.toString().padStart(2, '0');
    const mm = minutosFinal.toString().padStart(2, '0');
    return `${hh}:${mm}`;
  }

  // private labAnaliticaSubject = new BehaviorSubject<string>('1A');
  // labAnalitica$ = this.labAnaliticaSubject.asObservable();

  // actualizarLabAnalitica(lab: string) {
  //   this.labAnaliticaSubject.next(lab);
  // }
}
