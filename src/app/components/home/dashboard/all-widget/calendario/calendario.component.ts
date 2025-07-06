import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { EventDialogComponent } from './event-dialog/event-dialog.component';
import { DateDialogComponent } from './date-dialog/date-dialog.component';
import { UtilitiesService } from '../../../../../services/Utilities/utilities.service';
import { ServicioDashboardService } from '../../../../../services/Dashboard/servicio-dashboard.service';
import { LaboratorioService } from '../../../../../services/Laboratorio/laboratorio.service';
import { DatosService } from '../../../../../services/Datos/datos.service';

@Component({
  selector: 'app-calendario',
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css',
})
export class CalendarioComponent {
  @ViewChild('calendarHost', { static: true })
  host!: ElementRef<HTMLDivElement>;
  @ViewChild('fc') calendarComponent!: FullCalendarComponent;
  opcionesCalendario: CalendarOptions;

  endpoint: string = `${process.env['API_URL']}${process.env['ENDPOINT_RESERVA_ESPACIO_PISO']}`;
  endpointReservas: string = `${process.env['API_URL']}${process.env['ENDPOINT_RESERVA_ESPACIO']}`;
  endpointLab: string = `${process.env['API_URL']}${process.env['ENDPOINT_LABORATORIO_ID']}`;
  endpointEstado: string = `${process.env['API_URL']}${process.env['ENDPOINT_ESTADO']}`;

  constructor(
    private _toastr: ToastrService,
    private _calendario: CalendarioService,
    private _dashboard: ServicioDashboardService,
    private _lab: LaboratorioService,
    public dialog: MatDialog,
    private _utilities: UtilitiesService,
    private _datos: DatosService
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
    this._datos.obtenerPiso$.subscribe({
      next: (piso) => {
        if (piso != 4) {
          this._dashboard
            .getReservaPiso(this.endpoint, piso, {
              params: {
                start: info.startStr,
                end: info.endStr,
              },
            })
            .subscribe(
              (data: any) => {
                const eventosObservables = data.map((e: any) => {
                  return forkJoin({
                    lab: this._lab.getLaboratorioPorId(e.idLaboratorio),
                    estado: this._calendario.getEstado(
                      this.endpointEstado,
                      e.idEstado
                    ),
                  }).pipe(
                    map(({ lab, estado }) => ({
                      id: e.id,
                      title: lab.codigoDeLab,
                      start: e.fechaInicio,
                      end: e.fechaFinal,
                      extendedProps: {
                        estado: estado.estado1,
                        motivo: e.motivo,
                        horaInicio: this._utilities.formatearHora(e.horaInicio),
                        horaFin: this._utilities.formatearHora(e.horaFinal),
                      },
                    }))
                  );
                });

                forkJoin(eventosObservables).subscribe(
                  (eventos) => {
                    console.log(eventos);
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
        } else {
          this._calendario.getReservas(this.endpointReservas, {
              params: {
                start: info.startStr,
                end: info.endStr,
              },
            })
            .subscribe(
              (data: any) => {
                const eventosObservables = data.datos.map((e: any) => {
                  return forkJoin({
                    lab: this._lab.getLaboratorioPorId(e.idLaboratorio),
                    estado: this._calendario.getEstado(
                      this.endpointEstado,
                      e.idEstado
                    ),
                  }).pipe(
                    map(({ lab, estado }) => ({
                      id: e.id,
                      title: lab.codigoDeLab,
                      start: e.fechaInicio,
                      end: e.fechaFinal,
                      extendedProps: {
                        estado: estado.estado1,
                        motivo: e.motivo,
                        horaInicio: this._utilities.formatearHora(e.horaInicio),
                        horaFin: this._utilities.formatearHora(e.horaFinal),
                      },
                    }))
                  );
                });

                forkJoin(eventosObservables).subscribe(
                  (eventos) => {
                    console.log(eventos);
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
      },
      error: (err) => {
        this._toastr.error(err, 'Hubo un error');
      },
    });
  }

  handleEventClick(info: any): void {
    const evento = info.event;
    this.dialog.open(EventDialogComponent, {
      data: {
        lab: evento.title,
        estado: evento.extendedProps.estado,
        motivo: evento.extendedProps.motivo,
        inicio: this._utilities.formatearHorarioFecha(evento.startStr),
        fin: this._utilities.formatearHorarioFecha(evento.endStr),
        horaInicio: evento.extendedProps.horaInicio,
        horaFin: evento.extendedProps.horaFin,
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
        inicio: this._utilities.formatearHorarioFecha(evt.startStr),
        fin: this._utilities.formatearHorarioFecha(evt.endStr),
        horaInicio: evt.extendedProps.horaInicio,
        horaFin: evt.extendedProps.horaFin,
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
}
