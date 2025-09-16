import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import { CalendarOptions, ViewApi } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { CalendarioService } from '../../../../../services/Api/Calendario/calendario.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, forkJoin, map, of, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EventDialogComponent } from './event-dialog/event-dialog.component';
import { DateDialogComponent } from './date-dialog/date-dialog.component';
import { UtilitiesService } from '../../../../../services/Utilities/utilities.service';
import { ServicioDashboardService } from '../../../../../services/Dashboard/servicio-dashboard.service';
import { LaboratorioService } from '../../../../../services/Laboratorio/laboratorio.service';
import { PisosService } from '../../../../../services/Pisos/pisos.service';
import { UsuarioService } from '../../../usuario/usuarios/usuarios.service';

@Component({
  selector: 'app-calendario',
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css',
})
export class CalendarioComponent implements OnDestroy, AfterViewInit {
  @ViewChild('calendarHost', { static: true })
  host!: ElementRef<HTMLDivElement>;
  @ViewChild('fc') calendarComponent!: FullCalendarComponent;
  opcionesCalendario: CalendarOptions;

  private subs: Subscription[] = [];

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
    private _piso: PisosService,
    private _usuario: UsuarioService
  ) {
    this.opcionesCalendario = {
      initialView: this.getResponsiveView(),
      windowResize: this.onCalendarResize.bind(this),
      events: this.fetchEventos.bind(this),
      eventClick: this.handleEventClick.bind(this),
      dateClick: this.handleDateClick.bind(this),
      locales: [esLocale],
      locale: 'es',
      plugins: [dayGridPlugin, interactionPlugin],
      height: 'auto',
      contentHeight: 'auto',
      windowResizeDelay: 100,
    };
  }

  getResponsiveView(): string {
    const width = window.innerWidth;

    if (width < 600) return 'dayGridDay'; // Móviles pequeños
    if (width < 768) return 'dayGridWeek'; // Móviles medianos
    if (width < 992) return 'dayGridWeek'; // Tablets
    return 'dayGridMonth'; // Escritorio
  }

  onCalendarResize(arg: { view: ViewApi }) {
    const api = this.calendarComponent.getApi();
    const newView = this.getResponsiveView();
    if (api.view.type !== newView) {
      api.changeView(newView);
    }
  }

  ngAfterViewInit() {
    window.addEventListener('resize', () => {
      const api = this.calendarComponent?.getApi();
      if (api) {
        api.changeView(this.getResponsiveView());
      }
    });
  }

  fetchEventos(info: any, successCallback: any, failureCallback: any) {
    const sub = this._piso.piso$.subscribe({
      next: (piso) => {
        if (piso != 4) {
          this._dashboard
            .getReservaPiso(this.endpoint, piso, {
              params: {
                start: info.startStr,
                end: info.endStr,
              },
            })
            .pipe(
              map((res: any) => (Array.isArray(res) ? res : [])),
              catchError((err) => {
                console.warn('Reservas error:', err?.error || err?.message);
                return of([]); // 💡 Aquí resolvemos el error devolviendo un array vacío
              })
            )
            .subscribe(
              (data: any) => {
                const eventosObservables = data.map((e: any) => {
                  return forkJoin({
                    lab: this._lab.getLaboratorioPorId(e.idLaboratorio),
                    estado: this._calendario.getEstado(
                      this.endpointEstado,
                      e.idEstado
                    ),
                    usuario: this._usuario.obtenerUsuarioId(e.idUsuario),
                  }).pipe(
                    map(({ lab, estado, usuario }) => ({
                      id: e.id,
                      title: lab.nombre,
                      start: e.fechaInicio,
                      end: e.fechaFinal,
                      extendedProps: {
                        estado: estado.estado1,
                        motivo: e.motivo,
                        horaInicio: this._utilities.formatearHora(e.horaInicio),
                        horaFin: this._utilities.formatearHora(e.horaFinal),
                        solicitante: `${usuario.nombreUsuario} ${usuario.apellidoUsuario}`,
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
        } else {
          this._calendario
            .getReservas(this.endpointReservas, {
              params: {
                start: info.startStr,
                end: info.endStr,
              },
            })
            .pipe(
              map((res: any) => (Array.isArray(res.datos) ? res : [])),
              catchError((err) => {
                console.warn('Reservas error:', err?.error || err?.message);
                return of([]); // 💡 Aquí resolvemos el error devolviendo un array vacío
              })
            )
            .subscribe(
              (data: any) => {
                const eventosObservables = data.datos.map((e: any) => {
                  return forkJoin({
                    lab: this._lab.getLaboratorioPorId(e.idLaboratorio),
                    estado: this._calendario.getEstado(
                      this.endpointEstado,
                      e.idEstado
                    ),
                    usuario: this._usuario.obtenerUsuarioId(e.idUsuario),
                  }).pipe(
                    map(({ lab, estado, usuario }) => ({
                      id: e.id,
                      title: lab.nombre,
                      start: e.fechaInicio,
                      end: e.fechaFinal,
                      extendedProps: {
                        estado: estado.estado1,
                        motivo: e.motivo,
                        horaInicio: this._utilities.formatearHora(e.horaInicio),
                        horaFin: this._utilities.formatearHora(e.horaFinal),
                        solicitante: `${usuario.nombreUsuario} ${usuario.apellidoUsuario}`,
                      },
                    }))
                  );
                });

                if (eventosObservables.length > 0) {
                  forkJoin(eventosObservables).subscribe(
                    (eventos) => {
                      successCallback(eventos);
                    },
                    (error) => {
                      failureCallback(error);
                    }
                  );
                } else {
                  successCallback([]); // Si no hay eventos, devolvemos un array vacío
                }
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

    this.subs.push(sub);
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
        solicitante: evento.extendedProps.solicitante || 'N/A',
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
        solicitante: evt.extendedProps.solicitante || 'N/A',
      }));

      this.dialog.open(DateDialogComponent, {
        data: {
          info: detalles,
        },
        width: '30rem',
      });
    } else {
      this._toastr.info('No hay eventos en esta fecha.', 'Información');
    }
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
