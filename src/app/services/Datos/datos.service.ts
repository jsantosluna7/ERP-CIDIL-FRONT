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

  private timerDataSubject = new BehaviorSubject<any[]>([]);
  timerData$ = this.timerDataSubject.asObservable();

  private tabListSubject = new BehaviorSubject<string[]>([]);
  tabList$ = this.tabListSubject.asObservable();

  private obtenerPisoSubject = new BehaviorSubject<number>(1);
  obtenerPiso$ = this.obtenerPisoSubject.asObservable();

  obtenerPiso(piso: number) {
    this.obtenerPisoSubject.next(piso);
  }

  private obtenerPisoHorarioSubject = new BehaviorSubject<number>(1);
  obtenerPisoHorario$ = this.obtenerPisoHorarioSubject.asObservable();

  obtenerPisoHorario(piso: number) {
    this.obtenerPisoHorarioSubject.next(piso);
  }

  actualizarTabList(tabList: string[]) {
    this.tabListSubject.next(tabList);
  }

  obtenerData(data: any[]) {
    this.jsonDataSubject.next(data);
  }

  obtenerFecha(fecha: any) {
    this.fechaDataSubject.next(fecha);
  }

  timerFecha(timer: any) {
    this.timerDataSubject.next(timer);
  }

  excelTiempoAString(excelSerial: number): string {
    const horasTotales = excelSerial * 24;
    const horas = Math.floor(horasTotales);
    const minutos = Math.round((horasTotales - horas) * 60);
    const hh = horas.toString().padStart(2, '0');
    const mm = minutos.toString().padStart(2, '0');
    return `${hh}:${mm}`;
  }

  // private labAnaliticaSubject = new BehaviorSubject<string>('1A');
  // labAnalitica$ = this.labAnaliticaSubject.asObservable();

  // actualizarLabAnalitica(lab: string) {
  //   this.labAnaliticaSubject.next(lab);
  // }
}
