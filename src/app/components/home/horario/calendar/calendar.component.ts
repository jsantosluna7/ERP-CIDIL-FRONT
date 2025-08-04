import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import { CalendarOptions, ViewApi } from '@fullcalendar/core/index.js';
import { ToastrService } from 'ngx-toastr';
import { HorarioService } from '../../../../services/Api/Horario/horario.service';
import { LaboratorioService } from '../../../../services/Laboratorio/laboratorio.service';
import { MatDialog } from '@angular/material/dialog';
import { UtilitiesService } from '../../../../services/Utilities/utilities.service';
import { DateHorarioDialogComponent } from './date-horario-dialog/date-horario-dialog/date-horario-dialog.component';
import interactionPlugin, {
  DateClickArg,
} from '@fullcalendar/interaction/index.js';
import { EventHorarioDialogComponent } from './event-horario-dialog/event-horario-dialog/event-horario-dialog.component';
import { forkJoin, map, Observable } from 'rxjs';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PisosService } from '../../../../services/Pisos/pisos.service';

@Component({
  selector: 'app-calendar',
  imports: [
    CommonModule,
    FullCalendarModule,
    MatTabsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {
  @ViewChild('horarioCalendar', { static: true })
  host!: ElementRef<HTMLDivElement>;
  @ViewChild('hc') calendarComponent!: FullCalendarComponent;
  opcionesCalendario: CalendarOptions;
  loading: any;
  secondLoading: boolean = false;

  panelOpen = true;

  pisoSeleccionado: number = 0; // 0 = 1er piso, 1 = 2do piso...
  mostrarComponente = true;

  endpoint: string = `${process.env['API_URL']}${process.env['ENDPOINT_HORARIO_TODOS']}`;
  endpointPisos: string = `${process.env['API_URL']}${process.env['ENDPOINT_HORARIO_PISO']}`;
  endpointLab: string = `${process.env['API_URL']}${process.env['ENDPOINT_LABORATORIO']}`;
  endpointEstado: string = `${process.env['API_URL']}${process.env['ENDPOINT_ESTADO']}`;

  constructor(
    private _toastr: ToastrService,
    private _horario: HorarioService,
    private _lab: LaboratorioService,
    public dialog: MatDialog,
    private _utilities: UtilitiesService,
    private _piso: PisosService
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
    this.loading = true; // Comienza el loading
    this._piso.pisoHorario$.subscribe({
      next: (pisos) => {
        if (pisos != 4) {
          this._horario
            .getHorarioPisos(this.endpointPisos, pisos, {
              params: {
                start: info.startStr,
                end: info.endStr,
              },
            })
            .subscribe({
              next: (data: any) => {
                const observables = data
                  .map((e: any) => {
                    // Mapear el día como número: 0 = domingo, 1 = lunes, ..., 6 = sábado
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
                      map(({ lab }) => {
                        const start = e.horaInicio;
                        const end = e.horaFinal;

                        return {
                          id: e.id,
                          title: e.asignatura,
                          daysOfWeek: [dow],
                          start,
                          end,
                          startRecur: e.fechaInicio,
                          endRecur: e.fechaFinal,
                          extendedProps: {
                            profesor: e.profesor,
                            labNombre: lab.nombre,
                            dia: e.dia,
                            horaInicio: this._utilities.formatearHora(
                              e.horaInicio
                            ),
                            horaFinal: this._utilities.formatearHora(
                              e.horaFinal
                            ),
                            fechaInicio: this._utilities.formatearHorarioFecha(
                              e.fechaInicio
                            ),
                            fechaFinal: this._utilities.formatearHorarioFecha(
                              e.fechaFinal
                            ),
                          },
                        };
                      })
                    );
                  })
                  .filter((obs: any) => obs !== null) as Observable<any>[];

                forkJoin(observables).subscribe(
                  (events) => {
                    successCallback(events);
                    this.loading = false;
                  },
                  (err) => {
                    failureCallback(err);
                    this.loading = false;
                  }
                );
              },
              error: (err) => {
                failureCallback(err);
                this.loading = false;
              },
            });
        } else {
          this.loading = true;

          this._horario
            .getHorarioCalendario(this.endpoint, {
              params: {
                start: info.startStr,
                end: info.endStr,
              },
            })
            .subscribe({
              next: (data: any) => {
                const observables = data
                  .map((e: any) => {
                    // Mapear el día como número: 0 = domingo, 1 = lunes, ..., 6 = sábado
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
                      map(({ lab }) => {
                        const start = e.horaInicio;
                        const end = e.horaFinal;

                        return {
                          id: e.id,
                          title: e.asignatura,
                          daysOfWeek: [dow],
                          start,
                          end,
                          startRecur: e.fechaInicio,
                          endRecur: e.fechaFinal,
                          extendedProps: {
                            profesor: e.profesor,
                            labNombre: lab.nombre,
                            dia: e.dia,
                            horaInicio: this._utilities.formatearHora(
                              e.horaInicio
                            ),
                            horaFinal: this._utilities.formatearHora(
                              e.horaFinal
                            ),
                            fechaInicio: this._utilities.formatearHorarioFecha(
                              e.fechaInicio
                            ),
                            fechaFinal: this._utilities.formatearHorarioFecha(
                              e.fechaFinal
                            ),
                          },
                        };
                      })
                    );
                  })
                  .filter((obs: any) => obs !== null) as Observable<any>[];

                forkJoin(observables).subscribe(
                  (events) => {
                    successCallback(events);
                    this.loading = false;
                  },
                  (err) => {
                    failureCallback(err);
                    this.loading = false;
                  }
                );
              },
              error: (err) => {
                failureCallback(err);
                this.loading = false;
              },
            });
        }
      },
    });
  }

  handleEventClick(info: any): void {
    const evento = info.event;
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

  handleDateClick(arg: DateClickArg) {
    const api = this.calendarComponent.getApi();
    const eventos = api.getEvents();

    const seleccionados = eventos.filter((evt) =>
      evt.startStr.startsWith(arg.dateStr)
    );
    if (seleccionados.length) {
      const detalles = seleccionados.map((evt: any) => ({
        asignatura: evt.title,
        profesor: evt.extendedProps.profesor,
        labNombre: evt.extendedProps.labNombre,
        dia: evt.extendedProps.dia,
        horaInicio: evt.extendedProps.horaInicio,
        horaFinal: evt.extendedProps.horaFinal,
        fechaInicio: evt.extendedProps.fechaInicio,
        fechaFinal: evt.extendedProps.fechaFinal,
      }));

      // Abrir el diálogo con los detalles de los eventos
      this.dialog.open(DateHorarioDialogComponent, {
        data: {
          info: detalles,
        },
        width: '40rem',
      });
    } else {
      this._toastr.info('No hay eventos en esta fecha.', 'Información');
    }
  }

  cambiarPiso(index: number) {
    this.pisoSeleccionado = index;
    switch (index) {
      case 0:
        this._piso.setPisoHorario(1);
        break;
      case 1:
        this._piso.setPisoHorario(2);
        break;
      case 2:
        this._piso.setPisoHorario(3);
        break;
      case 3:
        this._piso.setPisoHorario(4);
        break;
    }

    // 🔁 Forzar la recreación del componente
    this.mostrarComponente = false;
    setTimeout(() => {
      this.mostrarComponente = true;
    }, 0);
    // this._datos.actualizarLabAnalitica(this.tabList[0]);
  }
}
