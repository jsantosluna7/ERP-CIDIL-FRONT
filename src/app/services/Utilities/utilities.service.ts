import { DatePipe, formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  constructor(public _datePipe: DatePipe, private _toastr: ToastrService) {}

  formatearFecha(fechaOriginal: string): string | null {
    return this._datePipe.transform(fechaOriginal, 'dd/MM/yyyy hh:mm a');
  }

  formatearHorarioFecha(fechaOriginal: string): string | null {
    return this._datePipe.transform(fechaOriginal, 'dd/MM/yyyy');
  }

  desformatearHorarioFecha(fechaOriginal: string): string | null {
    const parts = fechaOriginal.split('/');
    const dateObj = new Date(+parts[2], +parts[1] - 1, +parts[0]);
    const formattedDate = this._datePipe.transform(dateObj, 'yyyy-MM-dd');
    return formattedDate;
  }

  formatearHora(horaOriginal: string): string | null {
    const date = new Date(`1970-01-01T${horaOriginal}Z`);
    return this._datePipe.transform(date, 'h:mm a', 'UTC');
  }

  desformatearHora(horaOriginal: string): string | null {
    try {
      const h12 = horaOriginal;
      const dateObj = new Date(`1970-01-01 ${h12}`);
      const hora24 = this._datePipe.transform(dateObj, 'HH:mm:ss');
      return hora24;
    } catch (error: any) {
      console.log(error);
      this._toastr.error(
        'No se pudo editar la hora, debe ser 00:00 AM/PM',
        'Error'
      );
      return null;
    }
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
    return msg.replace(
      /(\d{2}\/\d{2}\/\d{4}) (\d{2}:\d{2}:\d{2})/g,
      (_m, date, time) => {
        const [m, d, y] = date.split('/');
        const iso = `${y}-${m}-${d}T${time}Z`;
        const dt = new Date(iso);
        return this._datePipe.transform(dt, 'hh:mm a')!;
      }
    );
  }
}
