import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import { CalendarioService } from '../../../../../services/Api/Calendario/calendario.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-calendario',
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css',
})
export class CalendarioComponent implements OnInit {
  endpoint: string = `${process.env['API_URL']}${process.env['ENDPOINT_RESERVA_ESPACIO']}`;
  endpointLab: string = `${process.env['API_URL']}${process.env['ENDPOINT_LABORATORIO_ID']}`;

  constructor(private _calendario: CalendarioService, private _toastr: ToastrService) {}

  ngOnInit(): void {
    this._calendario.getReservas(this.endpoint).subscribe({
      next: (e) => {
        console.log(e);
      },error: (e) => {
        this._toastr.error(e.error, 'Hubo un error');
      }
    });

    this._calendario.getLaboratorio(this.endpointLab, '1').subscribe((e: any) => {
      console.log(e)
    })
  }

  opcionesCalendario: CalendarOptions = {
    initialView: 'dayGridMonth',
    locales: [esLocale],
    locale: 'es',
    plugins: [dayGridPlugin],
  };
}
