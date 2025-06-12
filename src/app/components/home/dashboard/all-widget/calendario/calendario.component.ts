import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { CalendarioService } from '../../../../../services/Api/Calendario/calendario.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, map } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventDialogComponent } from './event-dialog/event-dialog.component';
import { DateDialogComponent } from './date-dialog/date-dialog.component';

@Component({
  selector: 'app-calendario',
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css',
  providers: [DatePipe],
})
export class CalendarioComponent {
  @ViewChild('calendarHost', { static: true }) host!: ElementRef<HTMLDivElement>;
  @ViewChild('fc') calendarComponent!: FullCalendarComponent;
  opcionesCalendario: CalendarOptions;

  endpoint: string = `${process.env['API_URL']}${process.env['ENDPOINT_RESERVA_ESPACIO']}`;
  endpointLab: string = `${process.env['API_URL']}${process.env['ENDPOINT_LABORATORIO_ID']}`;
  endpointEstado: string = `${process.env['API_URL']}${process.env['ENDPOINT_ESTADO']}`;

  constructor(
    private _toastr: ToastrService,
    private _calendario: CalendarioService,
    public dialog: MatDialog,
    public _datePipe: DatePipe
  ) {
    this.opcionesCalendario = {
      initialView: 'dayGridMonth',
      events: this.fetchEventos.bind(this),
      eventClick: this.handleEventClick.bind(this),
      dateClick: this.handleDateClick.bind(this),
      locales: [esLocale],
      locale: 'es',
      plugins: [dayGridPlugin, interactionPlugin],
      height: '100%', // ocupa toda la altura del contenedor
    };
  }

  fetchEventos(info: any, successCallback: any, failureCallback: any) {
    this._calendario
      .getReservas(this.endpoint, {
        params: {
          start: info.startStr,
          end: info.endStr,
        },
      })
      .subscribe(
        (data: any) => {
          const eventosObservables = data.datos.map((e: any) => {
            return forkJoin({
              lab: this._calendario.getLaboratorio(
                this.endpointLab,
                e.idLaboratorio
              ),
              estado: this._calendario.getEstado(
                this.endpointEstado,
                e.idEstado
              ),
            }).pipe(
              map(({ lab, estado }) => ({
                id: e.id,
                title: lab.codigoDeLab,
                start: e.horaInicio,
                end: e.horaFinal,
                extendedProps: {
                  estado: estado.estado1,
                  motivo: e.motivo,
                },
              }))
            );
          });

          forkJoin(eventosObservables).subscribe(
            (eventos) => {
              successCallback(eventos);
            },
            (error) => {
              failureCallback(error);
            }
          );
        },
        (error) => {
          failureCallback(error);
        }
      );
  }

  handleEventClick(info: any): void {
    const evento = info.event;
    this.dialog.open(EventDialogComponent, {
      data: {
        lab: evento.title,
        estado: evento.extendedProps.estado,
        motivo: evento.extendedProps.motivo,
        inicio: this.formatearFecha(evento.startStr),
        fin: this.formatearFecha(evento.endStr),
      },
    });
  }

  handleDateClick(arg: DateClickArg) {
    const api = this.calendarComponent.getApi();
    const eventos = api.getEvents();

    const seleccionados = eventos.filter((evt) =>
      evt.startStr.startsWith(arg.dateStr)
    );
    if (seleccionados.length) {
      const detalles = seleccionados.map((evt: any) => ({
        lab: evt.title,
        estado: evt.extendedProps.estado,
        motivo: evt.extendedProps.motivo,
        inicio: this.formatearFecha(evt.startStr),
        fin: this.formatearFecha(evt.endStr),
      }));

      this.dialog.open(DateDialogComponent, {
        data: {
          info: detalles,
        },
        width: '30rem',
      });
      console.log(detalles);
    } else {
      this._toastr.info('No hay eventos en esta fecha.', 'Información');
    }
  }

  formatearFecha(fechaOriginal: string): string | null {
    return this._datePipe.transform(fechaOriginal, 'dd/MM/yyyy hh:mm a');
  }
}
