import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor(public _datePipe: DatePipe,) { }

  
  formatearFecha(fechaOriginal: string): string | null {
    return this._datePipe.transform(fechaOriginal, 'dd/MM/yyyy hh:mm a');
  }

  desformatearFecha(fechaOriginal: string): string {
    const [fecha, hora, ampm] = fechaOriginal.split(' ');
    const [dia, mes, anio] = fecha.split('/');
    let [horaStr, minutoStr] = hora.split(':');

    let horaNum = parseInt(horaStr, 10);

    // Ajustar hora según AM/PM
    if (ampm.toUpperCase() === 'PM' && horaNum < 12) {
      horaNum += 12;
    } else if (ampm.toUpperCase() === 'AM' && horaNum === 12) {
      horaNum = 0;
    }

    // Asegurar formato de dos dígitos
    const horaFinal = horaNum.toString().padStart(2, '0');
    const minutoFinal = minutoStr.padStart(2, '0');
    const mesFinal = mes.padStart(2, '0');
    const diaFinal = dia.padStart(2, '0');

    return `${anio}-${mesFinal}-${diaFinal}T${horaFinal}:${minutoFinal}`;
  }

  formatearAISOLocal(fechaStr: string, horaStr: string): string {
    const IsoLocal = `${fechaStr}T${horaStr}:00.000`;
    const fecha = new Date(IsoLocal);

    return fecha.toISOString();
  }

  formatearHoraError(msg: string): string {
  return msg.replace(/(\d{2}\/\d{2}\/\d{4}) (\d{2}:\d{2}:\d{2})/g,
    (_m, date, time) => {
      const [m, d, y] = date.split("/");
      const iso = `${y}-${m}-${d}T${time}Z`;
      const dt = new Date(iso);
      return this._datePipe.transform(dt, 'hh:mm a')!;
    });
}
}
