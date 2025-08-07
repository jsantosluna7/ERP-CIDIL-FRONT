import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { ToastrService } from 'ngx-toastr';
import { catchError, forkJoin, map, Observable, of, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CalendarioService } from '../../../services/Api/Calendario/calendario.service';
import { ServicioDashboardService } from '../../../services/Dashboard/servicio-dashboard.service';
import { LaboratorioService } from '../../../services/Laboratorio/laboratorio.service';
import { UtilitiesService } from '../../../services/Utilities/utilities.service';
import { PisosService } from '../../../services/Pisos/pisos.service';
import { EventDialogComponent } from '../dashboard/all-widget/calendario/event-dialog/event-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HorarioService } from '../../../services/Api/Horario/horario.service';
import { EventHorarioDialogComponent } from '../horario/calendar/event-horario-dialog/event-horario-dialog/event-horario-dialog.component';
import { DateDialogHomeComponent } from './date-dialog-home/date-dialog-home.component';

@Component({
  selector: 'app-calendario-home',
  imports: [
    CommonModule,
    FullCalendarModule,
    MatTabsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './calendario-home.component.html',
  styleUrl: './calendario-home.component.css',
})
export class CalendarioHomeComponent implements OnDestroy {
  @ViewChild('calendarHost', { static: true })
  host!: ElementRef<HTMLDivElement>;
  @ViewChild('fc') calendarComponent!: FullCalendarComponent;
  opcionesCalendario: CalendarOptions;

  private subs: Subscription[] = [];

  pisoSeleccionado: number = 0; // 0 = 1er piso, 1 = 2do piso...
  mostrarComponente = true;

  loading: any;

  endpoint: string = `${process.env['API_URL']}${process.env['ENDPOINT_RESERVA_ESPACIO_PISO']}`;
  endpointHorario: string = `${process.env['API_URL']}${process.env['ENDPOINT_HORARIO_TODOS']}`;
  endpointHorarioPisos: string = `${process.env['API_URL']}${process.env['ENDPOINT_HORARIO_PISO']}`;
  endpointReservas: string = `${process.env['API_URL']}${process.env['ENDPOINT_RESERVA_ESPACIO']}`;
  endpointLab: string = `${process.env['API_URL']}${process.env['ENDPOINT_LABORATORIO_ID']}`;
  endpointEstado: string = `${process.env['API_URL']}${process.env['ENDPOINT_ESTADO']}`;

  constructor(
    private _toastr: ToastrService,
    private _calendario: CalendarioService,
    private _dashboard: ServicioDashboardService,
    private _lab: LaboratorioService,
    private _horario: HorarioService,
    public dialog: MatDialog,
    private _utilities: UtilitiesService,
    private _piso: PisosService
  ) {
    this.opcionesCalendario = {
      initialView: 'timeGridWeek',
      events: this.fetchEventos.bind(this),
      eventClick: this.handleEventClick.bind(this),
      dateClick: this.handleDateClick.bind(this),
      locales: [esLocale],
      locale: 'es',
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
      slotLabelFormat: {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true, // 👈 formato 12h
      },
      eventTimeFormat: {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true, // 👈 eventos en 12h
      },
      // 🎯 Ajuste de tamaño:
      height: 'auto',
      contentHeight: 'auto',
      handleWindowResize: true,
      stickyFooterScrollbar: false,
    };

    const isMobile = window.innerWidth < 600;
    this.opcionesCalendario.initialView = isMobile
      ? 'timeGridDay'
      : 'timeGridWeek';
  }

  fetchEventos(info: any, successCallback: any, failureCallback: any) {
    const sub = this._piso.pisoCalendario$.subscribe({
      next: (piso) => {
        if (piso != 4) {
          this.loading = true;
          const params = {
            start: info.startStr,
            end: info.endStr,
          };

          const reservas$ = this._dashboard
            .getReservaPiso(this.endpoint, piso, { params })
            .pipe(
              map((res: any) => (Array.isArray(res) ? res : [])),
              catchError((err) => {
                console.warn('Reservas error:', err?.error || err?.message);
                return of([]); // 💡 Aquí resolvemos el error devolviendo un array vacío
              })
            );

          const horarios$ = this._horario
            .getHorarioPisos(this.endpointHorarioPisos, piso, { params })
            .pipe(
              map((res: any) => (Array.isArray(res) ? res : [])),
              catchError((err) => {
                console.warn('Horarios error:', err?.error || err?.message);
                return of([]);
              })
            );

          forkJoin({ reservas: reservas$, horarios: horarios$ }).subscribe({
            next: ({ reservas, horarios }) => {
              const reservasObservables = reservas.map((e: any) =>
                forkJoin({
                  lab: this._lab.getLaboratorioPorId(e.idLaboratorio),
                  estado: this._calendario.getEstado(
                    this.endpointEstado,
                    e.idEstado
                  ),
                }).pipe(
                  map(({ lab, estado }) => ({
                    id: `res-${e.id}`,
                    title: lab.codigoDeLab,
                    start: e.fechaInicio,
                    end: e.fechaFinal,
                    extendedProps: {
                      tipo: 'reserva',
                      estado: estado.estado1,
                      motivo: e.motivo,
                      horaInicio: this._utilities.formatearHora(e.horaInicio),
                      horaFin: this._utilities.formatearHora(e.horaFinal),
                    },
                  }))
                )
              );

              const horariosObservables = horarios
                .map((e: any) => {
                  const dowMapping: Record<string, number> = {
                    domingo: 0,
                    lunes: 1,
                    martes: 2,
                    miércoles: 3,
                    jueves: 4,
                    viernes: 5,
                    sábado: 6,
                  };
                  const dow = dowMapping[e.dia.toLowerCase()];
                  if (dow === undefined) return null;

                  return forkJoin({
                    lab: this._lab.getLaboratorioPorId(e.idLaboratorio),
                  }).pipe(
                    map(({ lab }) => ({
                      id: `hor-${e.id}`,
                      title: e.asignatura,
                      daysOfWeek: [dow],
                      start: e.horaInicio,
                      end: e.horaFinal,
                      startRecur: e.fechaInicio,
                      endRecur: e.fechaFinal,
                      extendedProps: {
                        tipo: 'horario',
                        profesor: e.profesor,
                        labNombre: lab.nombre,
                        dia: e.dia,
                        horaInicio: this._utilities.formatearHora(e.horaInicio),
                        horaFinal: this._utilities.formatearHora(e.horaFinal),
                        fechaInicio: this._utilities.formatearHorarioFecha(
                          e.fechaInicio
                        ),
                        fechaFinal: this._utilities.formatearHorarioFecha(
                          e.fechaFinal
                        ),
                      },
                    }))
                  );
                })
                .filter((obs: any): obs is Observable<any> => obs !== null);

              forkJoin([
                this.forkJoinSalvo(reservasObservables) as Observable<any[]>,
                this.forkJoinSalvo(horariosObservables) as Observable<any[]>,
              ]).subscribe(
                ([eventosReservas, eventosHorarios]) => {
                  const eventos = [...eventosReservas, ...eventosHorarios];
                  successCallback(eventos);
                  this.loading = false;
                },
                (error) => {
                  failureCallback(error);
                  this.loading = false;
                }
              );
            },
            error: (err) => {
              this._toastr.error('Error al obtener datos', 'Error');
              this.loading = false;
              failureCallback(err);
            },
          });
        } else {
          this.loading = true;
          const params = {
            start: info.startStr,
            end: info.endStr,
          };

          const reservas$ = this._calendario
            .getReservas(this.endpointReservas, { params })
            .pipe(map((res: any) => res.datos));

          const horarios$ = this._horario.getHorarioCalendario(
            this.endpointHorario,
            { params }
          );

          forkJoin({ reservas: reservas$, horarios: horarios$ }).subscribe({
            next: ({ reservas, horarios }) => {
              const reservasObservables = reservas.map((e: any) =>
                forkJoin({
                  lab: this._lab.getLaboratorioPorId(e.idLaboratorio),
                  estado: this._calendario.getEstado(
                    this.endpointEstado,
                    e.idEstado
                  ),
                }).pipe(
                  map(({ lab, estado }) => ({
                    id: `res-${e.id}`,
                    title: lab.codigoDeLab,
                    start: e.fechaInicio,
                    end: e.fechaFinal,
                    extendedProps: {
                      tipo: 'reserva',
                      estado: estado.estado1,
                      motivo: e.motivo,
                      horaInicio: this._utilities.formatearHora(e.horaInicio),
                      horaFin: this._utilities.formatearHora(e.horaFinal),
                    },
                  }))
                )
              );

              const horariosObservables = horarios
                .map((e: any) => {
                  const dowMapping: Record<string, number> = {
                    domingo: 0,
                    lunes: 1,
                    martes: 2,
                    miércoles: 3,
                    jueves: 4,
                    viernes: 5,
                    sábado: 6,
                  };
                  const dow = dowMapping[e.dia.toLowerCase()];
                  if (dow === undefined) return null;

                  return forkJoin({
                    lab: this._lab.getLaboratorioPorId(e.idLaboratorio),
                  }).pipe(
                    map(({ lab }) => ({
                      id: `hor-${e.id}`,
                      title: e.asignatura,
                      daysOfWeek: [dow],
                      start: e.horaInicio,
                      end: e.horaFinal,
                      startRecur: e.fechaInicio,
                      endRecur: e.fechaFinal,
                      extendedProps: {
                        tipo: 'horario',
                        profesor: e.profesor,
                        labNombre: lab.nombre,
                        dia: e.dia,
                        horaInicio: this._utilities.formatearHora(e.horaInicio),
                        horaFinal: this._utilities.formatearHora(e.horaFinal),
                        fechaInicio: this._utilities.formatearHorarioFecha(
                          e.fechaInicio
                        ),
                        fechaFinal: this._utilities.formatearHorarioFecha(
                          e.fechaFinal
                        ),
                      },
                    }))
                  );
                })
                .filter((obs: any): obs is Observable<any> => obs !== null);

              forkJoin([
                forkJoin(reservasObservables) as Observable<any[]>,
                forkJoin(horariosObservables) as Observable<any[]>,
              ]).subscribe(
                ([eventosReservas, eventosHorarios]) => {
                  const eventos = [...eventosReservas, ...eventosHorarios];
                  successCallback(eventos);
                  this.loading = false;
                },
                (error) => {
                  failureCallback(error);
                  this.loading = false;
                }
              );
            },
            error: (err) => {
              this._toastr.error('Error al obtener datos', 'Error');
              this.loading = false;
              failureCallback(err);
            },
          });

          // this._calendario
          //   .getReservas(this.endpointReservas, {
          //     params: {
          //       start: info.startStr,
          //       end: info.endStr,
          //     },
          //   })
          //   .subscribe(
          //     (data: any) => {
          //       const eventosObservables = data.datos.map((e: any) => {
          //         return forkJoin({
          //           lab: this._lab.getLaboratorioPorId(e.idLaboratorio),
          //           estado: this._calendario.getEstado(
          //             this.endpointEstado,
          //             e.idEstado
          //           ),
          //         }).pipe(
          //           map(({ lab, estado }) => ({
          //             id: e.id,
          //             title: lab.codigoDeLab,
          //             start: e.fechaInicio,
          //             end: e.fechaFinal,
          //             extendedProps: {
          //               estado: estado.estado1,
          //               motivo: e.motivo,
          //               horaInicio: this._utilities.formatearHora(e.horaInicio),
          //               horaFin: this._utilities.formatearHora(e.horaFinal),
          //             },
          //           }))
          //         );
          //       });

          //       forkJoin(eventosObservables).subscribe(
          //         (eventos) => {
          //           successCallback(eventos);
          //         },
          //         (error) => {
          //           failureCallback(error);
          //         }
          //       );
          //     },
          //     (error) => {
          //       failureCallback(error);
          //     }
          //   );
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

    if (evento.extendedProps.tipo === 'reserva') {
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
    } else {
      this.dialog.open(EventHorarioDialogComponent, {
        data: {
          asignatura: evento.title,
          profesor: evento.extendedProps.profesor,
          labNombre: evento.extendedProps.labNombre,
          dia: evento.extendedProps.dia,
          horaInicio: evento.extendedProps.horaInicio,
          horaFinal: evento.extendedProps.horaFinal,
          fechaInicio: evento.extendedProps.fechaInicio,
          fechaFinal: evento.extendedProps.fechaFinal,
        },
      });
    }
  }

  handleDateClick(arg: DateClickArg) {
    const api = this.calendarComponent.getApi();
    const eventos = api.getEvents();

    const seleccionados = eventos.filter((evt) =>
      evt.startStr.startsWith(arg.dateStr)
    );

    if (seleccionados.length) {
      const detalles = seleccionados
        .map((evt: any) => {
          const tipo = evt.extendedProps.tipo;

          if (tipo === 'reserva') {
            return {
              tipo: 'reserva',
              lab: evt.title,
              estado: evt.extendedProps.estado,
              motivo: evt.extendedProps.motivo,
              inicio: this._utilities.formatearHorarioFecha(evt.startStr),
              fin: this._utilities.formatearHorarioFecha(evt.endStr),
              horaInicio: evt.extendedProps.horaInicio,
              horaFin: evt.extendedProps.horaFin,
            };
          } else if (tipo === 'horario') {
            return {
              tipo: 'horario',
              asignatura: evt.title,
              profesor: evt.extendedProps.profesor,
              labNombre: evt.extendedProps.labNombre,
              dia: evt.extendedProps.dia,
              horaInicio: evt.extendedProps.horaInicio,
              horaFinal: evt.extendedProps.horaFinal,
              fechaInicio: evt.extendedProps.fechaInicio,
              fechaFinal: evt.extendedProps.fechaFinal,
            };
          }

          return null;
        })
        .filter((d) => d !== null);

      this.dialog.open(DateDialogHomeComponent, {
        data: {
          info: detalles,
        },
        width: '40rem',
      });
    } else {
      this._toastr.info('No hay eventos en esta fecha.', 'Información');
    }
  }

  // handleDateClick(arg: DateClickArg) {
  //   const api = this.calendarComponent.getApi();
  //   const eventos = api.getEvents();

  //   const seleccionados = eventos.filter((evt) =>
  //     evt.startStr.startsWith(arg.dateStr)
  //   );
  //   if (seleccionados.length) {
  //     const detalles = seleccionados.map((evt: any) => ({
  //       lab: evt.title,
  //       estado: evt.extendedProps.estado,
  //       motivo: evt.extendedProps.motivo,
  //       inicio: this._utilities.formatearHorarioFecha(evt.startStr),
  //       fin: this._utilities.formatearHorarioFecha(evt.endStr),
  //       horaInicio: evt.extendedProps.horaInicio,
  //       horaFin: evt.extendedProps.horaFin,
  //     }));

  //     this.dialog.open(DateDialogComponent, {
  //       data: {
  //         info: detalles,
  //       },
  //       width: '30rem',
  //     });
  //   } else {
  //     this._toastr.info('No hay eventos en esta fecha.', 'Información');
  //   }
  // }

  cambiarPiso(index: number) {
    this.pisoSeleccionado = index;
    switch (index) {
      case 0:
        this._piso.setPisoCalendario(1);
        break;
      case 1:
        this._piso.setPisoCalendario(2);
        break;
      case 2:
        this._piso.setPisoCalendario(3);
        break;
      case 3:
        this._piso.setPisoCalendario(4);
        break;
    }

    // 🔁 Forzar la recreación del componente
    this.mostrarComponente = false;
    setTimeout(() => {
      this.mostrarComponente = true;
    }, 0);
    // this._datos.actualizarLabAnalitica(this.tabList[0]);
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }

  forkJoinSalvo(obsArray: Observable<any>[]): Observable<any[]> {
    return obsArray.length > 0 ? forkJoin(obsArray) : of([]); // Retorna un observable vacío si no hay observables
  }
}
