import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import { ToastrService } from 'ngx-toastr';
import { catchError, forkJoin, map, Observable, of, Subscription } from 'rxjs';
import { CalendarioService } from '../../../services/Api/Calendario/calendario.service';
import { ServicioDashboardService } from '../../../services/Dashboard/servicio-dashboard.service';
import { LaboratorioService } from '../../../services/Laboratorio/laboratorio.service';
import { HorarioService } from '../../../services/Api/Horario/horario.service';
import { MatDialog } from '@angular/material/dialog';
import { UtilitiesService } from '../../../services/Utilities/utilities.service';
import { PisosService } from '../../../services/Pisos/pisos.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { EventDialogComponent } from '../dashboard/all-widget/calendario/event-dialog/event-dialog.component';
import { EventHorarioDialogComponent } from '../horario/calendar/event-horario-dialog/event-horario-dialog/event-horario-dialog.component';
import { DateDialogHomeComponent } from '../calendario-home/date-dialog-home/date-dialog-home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-calendario-tv',
  imports: [
    CommonModule,
    FullCalendarModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    FontAwesomeModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './calendario-tv.component.html',
  styleUrl: './calendario-tv.component.css',
})
export class CalendarioTvComponent implements OnDestroy, AfterViewInit {
  @ViewChild('calendarHost', { static: true })
  host!: ElementRef<HTMLDivElement>;
  @ViewChild('fc') calendarComponent!: FullCalendarComponent;
  opcionesCalendario: CalendarOptions;

  private subs: Subscription[] = [];

  pisoSeleccionado: number = 0; // 0 = 1er piso, 1 = 2do piso...
  mostrarComponente = true;
  panelOpen = false;


  loading: any;

  private colorMap = new Map<number, string>();
  private colorIndex = 0;

private colores = [
  '#4A148C', '#EF6C00', '#455A64', '#1B5E20', '#C62828',
  '#283593', '#5E35B1', '#E65100', '#43A047', '#F44336',
  '#1565C0', '#8E24AA', '#4E342E', '#7E57C2', '#CE93D8',
  '#37474F', '#3F51B5', '#B71C1C', '#E53935', '#009688',
  '#512DA8', '#558B2F', '#6A1B9A', '#5D4037', '#880E4F',
  '#546E7A', '#1E88E5', '#AD1457', '#00796B', '#BF360C',
  '#607D8B', '#E91E63', '#3949AB', '#2E7D32', '#00897B',
  '#D81B60', '#D84315', '#795548', '#3E2723', '#C2185B',
  '#D32F2F', '#FB8C00', '#004D40', '#E53935', '#7E57C2',
  '#263238', '#43A047', '#6A1B9A', '#8E24AA', '#004D40'
];



  endpoint: string = `${process.env['API_URL']}${process.env['ENDPOINT_RESERVA_ESPACIO_PISO']}`;
  endpointHorario: string = `${process.env['API_URL']}${process.env['ENDPOINT_HORARIO_TODOS']}`;
  endpointHorarioPisos: string = `${process.env['API_URL']}${process.env['ENDPOINT_HORARIO_PISO']}`;
  endpointReservas: string = `${process.env['API_URL']}${process.env['ENDPOINT_RESERVA_ESPACIO_TODO']}`;
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
    private _piso: PisosService,
    private cdr: ChangeDetectorRef
  ) {
    // Detecta si hoy es sábado
    const hoy = new Date();
    const esSabado = hoy.getDay() === 6; // 6 = sábado

    this.opcionesCalendario = {
      // ✅ Solo mostrar el día actual
      initialView: 'timeGridDay',
      initialDate: hoy,

      // ✅ Eventos dinámicos
      events: this.fetchEventos.bind(this),
      eventClick: this.handleEventClick.bind(this),
      dateClick: this.handleDateClick.bind(this),
      locales: [esLocale],
      locale: 'es',
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
      eventContent: (arg) => {
        const { title, extendedProps } = arg.event;
        const profesor = extendedProps['profesor'] || 'Profesor no asignado';
        const lab = extendedProps['labNombre'] || 'Aula no especificada';
        const horaInicio = extendedProps['horaInicio'] || '';
        const horaFinal = extendedProps['horaFinal'] || '';

        const innerHtml = `
<div class="evento-card">
  <div class="evento-horas">
    <i class="fa-solid fa-clock"></i> ${horaInicio} - ${horaFinal}
  </div>
  <div class="evento-info">
    <div class="evento-titulo">${title}</div>
    <div class="evento-profesor">
      <i class="fa-solid fa-user"></i> ${profesor}
    </div>
    <div class="evento-lab">
      <i class="fa-solid fa-chalkboard"></i> ${lab}
    </div>
  </div>
</div>

  `;
        return { html: innerHtml };
      },

      // ✅ Horas visibles según el día
      slotMinTime: '08:00:00',
      slotMaxTime: esSabado ? '18:00:00' : '23:00:00',

      // ✅ Horario laboral
      businessHours: [
        {
          daysOfWeek: [1, 2, 3, 4, 5],
          startTime: '08:00',
          endTime: '23:00',
        },
        {
          daysOfWeek: [6],
          startTime: '08:00',
          endTime: '19:00',
        },
      ],

      // ✅ Formato de hora
      slotLabelFormat: {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      },
      eventTimeFormat: {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      },

      // ✅ Config visual
      slotEventOverlap: false,
      height: '100%',
      contentHeight: 'auto',
      handleWindowResize: true,
      stickyFooterScrollbar: false,
      timeZone: 'America/Santo_Domingo',

      // ✅ Quita los eventos "all-day"
      allDaySlot: false,
    };
  }

  private obtenerColorHorario(id: number): string {
    if (this.colorMap.has(id)) {
      return this.colorMap.get(id)!;
    }

    const color = this.colores[this.colorIndex % this.colores.length];
    this.colorMap.set(id, color);
    this.colorIndex++;

    return color;
  }

  ngAfterViewInit() {
    // Espera a que Angular pinte y el layout esté listo
    setTimeout(() => {
      try {
        const api = this.calendarComponent?.getApi();
        api?.render();
        api?.updateSize();
      } catch (e) {
        console.warn('Error actualizando FullCalendar', e);
      }
      this.cdr.detectChanges();
    }, 300);
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

          const horarios$ = this._horario
            .getHorarioPisos(this.endpointHorarioPisos, piso, { params })
            .pipe(
              map((res: any) => (Array.isArray(res) ? res : [])),
              catchError((err) => {
                console.warn('Horarios error:', err?.error || err?.message);
                return of([]);
              })
            );

          forkJoin({ horarios: horarios$ }).subscribe({
            next: ({ horarios }) => {
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
                    map(({ lab }) => {
                      const colorAleatorio = this.obtenerColorHorario(e.id);

                      return {
                        id: `hor-${e.id}`,
                        title: e.asignatura,
                        daysOfWeek: [dow],
                        startTime: e.horaInicio,
                        endTime: e.horaFinal,
                        startRecur: e.fechaInicio,
                        endRecur: e.fechaFinal,
                        allDay: false,
                        backgroundColor: colorAleatorio,
                        borderColor: colorAleatorio,
                        textColor: '#fff',
                        extendedProps: {
                          tipo: 'horario',
                          profesor: e.profesor,
                          labNombre: lab.nombre,
                          dia: e.dia,
                          horaInicio: this._utilities.formatearHora(
                            e.horaInicio
                          ),
                          horaFinal: this._utilities.formatearHora(e.horaFinal),
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
                .filter((obs: any): obs is Observable<any> => obs !== null);

              forkJoin([
                this.forkJoinSalvo(horariosObservables) as Observable<any[]>,
              ]).subscribe(
                ([eventosHorarios]) => {
                  const eventos = [...eventosHorarios];
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

          const horarios$ = this._horario
            .getHorarioCalendario(this.endpointHorario, { params })
            .pipe(
              map((res: any) => (Array.isArray(res) ? res : [])),
              catchError((err) => {
                console.warn('Horarios error:', err?.error || err?.message);
                return of([]);
              })
            );

          forkJoin({ horarios: horarios$ }).subscribe({
            next: ({ horarios }) => {
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
                    map(({ lab }) => {
                      const colorAleatorio = this.obtenerColorHorario(e.id);

                      return {
                        id: `hor-${e.id}`,
                        title: e.asignatura,
                        daysOfWeek: [dow],
                        startTime: e.horaInicio,
                        endTime: e.horaFinal,
                        startRecur: e.fechaInicio,
                        endRecur: e.fechaFinal,
                        allDay: false,
                        backgroundColor: colorAleatorio,
                        borderColor: colorAleatorio,
                        textColor: '#fff',
                        extendedProps: {
                          tipo: 'horario',
                          profesor: e.profesor,
                          labNombre: lab.nombre,
                          dia: e.dia,
                          horaInicio: this._utilities.formatearHora(
                            e.horaInicio
                          ),
                          horaFinal: this._utilities.formatearHora(e.horaFinal),
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
                .filter((obs: any): obs is Observable<any> => obs !== null);

              forkJoin([
                this.forkJoinSalvo(horariosObservables) as Observable<any[]>,
              ]).subscribe(
                ([eventosHorarios]) => {
                  const eventos = [...eventosHorarios];
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
      const detalles = seleccionados
        .map((evt: any) => {
          const tipo = evt.extendedProps.tipo;
          if (tipo === 'horario') {
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

    this.mostrarComponente = false;
    setTimeout(() => {
      this.mostrarComponente = true;

      // tras volver a mostrar, forzamos render/resize
      setTimeout(() => {
        try {
          const api = this.calendarComponent?.getApi();
          api?.render();
          api?.updateSize();
        } catch (e) {
          console.warn('updateSize error', e);
        }
      }, 200);
    }, 0);
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }

  forkJoinSalvo(obsArray: Observable<any>[]): Observable<any[]> {
    return obsArray.length > 0 ? forkJoin(obsArray) : of([]); // Retorna un observable vacío si no hay observables
  }
}
