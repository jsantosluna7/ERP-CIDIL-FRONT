import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  signal,
} from '@angular/core';
import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import { CalendarOptions, ViewApi } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
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
import {
  PisosService,
  CalendarioState,
} from '../../../../../services/Pisos/pisos.service';
import { UsuarioService } from '../../../usuario/usuarios/usuarios.service';

@Component({
  selector: 'app-calendario',
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css',
})
export class CalendarioComponent implements OnDestroy, AfterViewInit, OnInit {
  @ViewChild('calendarHost', { static: true })
  host!: ElementRef<HTMLDivElement>;
  @ViewChild('fc') calendarComponent!: FullCalendarComponent;
  opcionesCalendario: CalendarOptions;

  private subs: Subscription[] = [];
  isLoading = signal(false);

  // � Flag para controlar la primera restauración
  private shouldRestoreState = false;

  // Caché para evitar peticiones repetidas
  private labCache = new Map<number, any>();
  private estadoCache = new Map<number, any>();
  private usuarioCache = new Map<number, any>();

  endpoint: string = `${process.env['API_URL']}${process.env['ENDPOINT_RESERVA_ESPACIO_PISO']}`;
  endpointReservas: string = `${process.env['API_URL']}${process.env['ENDPOINT_RESERVA_ESPACIO_TODO']}`;
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
    private _usuario: UsuarioService,
  ) {
    this.opcionesCalendario = {
      initialView: this.getResponsiveView(),
      windowResize: this.onCalendarResize.bind(this),
      events: this.fetchEventos.bind(this),
      eventClick: this.handleEventClick.bind(this),
      dateClick: this.handleDateClick.bind(this),
      locales: [esLocale],
      locale: 'es',
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],

      height: 'auto',
      contentHeight: 'auto',
      windowResizeDelay: 100,

      dayMaxEvents: 3,
      moreLinkClick: 'popover',

      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,dayGridDay',
      },

      eventContent: this.renderEventContent.bind(this),
      loading: this.handleLoading.bind(this),
      eventClassNames: this.getEventClassNames.bind(this),

      // � Guardar estado cuando cambie (pero solo después de restaurar)
      datesSet: this.onDatesSet.bind(this),
    };
  }

  ngOnInit() {
    // � Verificar si hay estado guardado
    const savedState = this._piso.getCalendarioState();
    if (savedState) {
      this.shouldRestoreState = true;
    }
  }

  ngAfterViewInit() {
    window.addEventListener('resize', () => {
      const api = this.calendarComponent?.getApi();
      if (api) {
        api.changeView(this.getResponsiveView());
      }
    });

    // � Restaurar estado si existe
    if (this.shouldRestoreState) {
      setTimeout(() => {
        this.restoreCalendarState();
        this.shouldRestoreState = false; // Evitar restauraciones futuras innecesarias
      }, 200);
    }
  }

  // � Guardar estado en el servicio (solo si no estamos restaurando)
  private onDatesSet(dateInfo: any) {
    if (!this.shouldRestoreState) {
      const state: CalendarioState = {
        fecha: new Date(dateInfo.view.currentStart),
        vista: dateInfo.view.type,
      };
      this._piso.setCalendarioState(state);
    }
  }

  // � Restaurar el calendario al estado guardado
  private restoreCalendarState() {
    const state = this._piso.getCalendarioState();

    if (!state || !this.calendarComponent) {
      return;
    }

    const api = this.calendarComponent.getApi();

    // Temporalmente deshabilitar el guardado automático
    this.shouldRestoreState = true;

    // Restaurar vista
    if (api.view.type !== state.vista) {
      api.changeView(state.vista);
    }

    // Restaurar fecha
    api.gotoDate(state.fecha);

    // Reactivar el guardado automático después de un momento
    setTimeout(() => {
      this.shouldRestoreState = false;
    }, 500);
  }

  renderEventContent(arg: any) {
    const { extendedProps } = arg.event;
    const isMonthView = arg.view.type === 'dayGridMonth';

    if (isMonthView) {
      return {
        html: `
          <div class="fc-event-custom">
            <span class="fc-event-time">${extendedProps.horaInicio}</span>
            <span class="fc-event-title">${arg.event.title}</span>
          </div>
        `,
      };
    } else {
      return {
        html: `
          <div class="fc-event-custom-detailed">
            <strong>${arg.event.title}</strong>
            <div class="fc-event-meta">
              <span>⏰ ${extendedProps.horaInicio} - ${extendedProps.horaFin}</span>
              <span class="fc-event-estado fc-event-estado-${extendedProps.estado?.toLowerCase()}">${extendedProps.estado}</span>
            </div>
          </div>
        `,
      };
    }
  }

  getEventClassNames(arg: any) {
    const estado = arg.event.extendedProps.estado?.toLowerCase() || '';
    return [`evento-${estado}`];
  }

  handleLoading(isLoading: boolean) {
    this.isLoading.set(isLoading);
  }

  getResponsiveView(): string {
    const width = window.innerWidth;
    if (width < 600) return 'dayGridDay';
    if (width < 768) return 'timeGridWeek';
    if (width < 992) return 'timeGridWeek';
    return 'dayGridMonth';
  }

  onCalendarResize(arg: { view: ViewApi }) {
    const api = this.calendarComponent.getApi();
    const newView = this.getResponsiveView();
    if (api.view.type !== newView) {
      api.changeView(newView);
    }
  }

  fetchEventos(info: any, successCallback: any, failureCallback: any) {
    const sub = this._piso.pisoCalendario$.subscribe({
      next: (piso) => {
        const reservasObs =
          piso !== 4
            ? this._dashboard.getReservaPiso(this.endpoint, piso, {
                params: { start: info.startStr, end: info.endStr },
              })
            : this._calendario.getReservas(this.endpointReservas, {
                params: { start: info.startStr, end: info.endStr },
              });

        reservasObs
          .pipe(
            map((res: any) => (Array.isArray(res) ? res : [])),
            catchError((err) => {
              console.warn(
                'Error cargando reservas:',
                err?.error || err?.message,
              );
              this._toastr.warning(
                'Error al cargar algunas reservas',
                'Advertencia',
              );
              return of([]);
            }),
          )
          .subscribe({
            next: (reservas: any[]) => {
              if (reservas.length === 0) {
                successCallback([]);
                return;
              }

              const labIds = [...new Set(reservas.map((r) => r.idLaboratorio))];
              const estadoIds = [...new Set(reservas.map((r) => r.idEstado))];
              const usuarioIds = [...new Set(reservas.map((r) => r.idUsuario))];

              forkJoin({
                labs: this.loadLaboratorios(labIds),
                estados: this.loadEstados(estadoIds),
                usuarios: this.loadUsuarios(usuarioIds),
              }).subscribe({
                next: ({ labs, estados, usuarios }) => {
                  const eventos = reservas.map((e: any) => {
                    const lab = labs.get(e.idLaboratorio);
                    const estado = estados.get(e.idEstado);
                    const usuario = usuarios.get(e.idUsuario);

                    return {
                      id: e.id,
                      title: lab?.nombre || 'Sin nombre',
                      start: e.fechaInicio,
                      end: e.fechaFinal,
                      backgroundColor: this.getColorByEstado(estado?.estado1),
                      borderColor: this.getColorByEstado(estado?.estado1),
                      extendedProps: {
                        estado: estado?.estado1 || 'Desconocido',
                        motivo: e.motivo,
                        horaInicio: this._utilities.formatearHora(e.horaInicio),
                        horaFin: this._utilities.formatearHora(e.horaFinal),
                        solicitante: usuario
                          ? `${usuario.nombreUsuario} ${usuario.apellidoUsuario}`
                          : 'N/A',
                      },
                    };
                  });

                  successCallback(eventos);
                },
                error: (err) => {
                  console.error('Error procesando eventos:', err);
                  failureCallback(err);
                },
              });
            },
            error: (err) => {
              failureCallback(err);
            },
          });
      },
      error: (err) => {
        this._toastr.error('Error al obtener el piso', 'Error');
        failureCallback(err);
      },
    });

    this.subs.push(sub);
  }

  private loadLaboratorios(ids: number[]) {
    const missing = ids.filter((id) => !this.labCache.has(id));

    if (missing.length === 0) {
      return of(this.labCache);
    }

    const requests = missing.map((id) =>
      this._lab.getLaboratorioPorId(id).pipe(
        map((lab) => ({ id, lab })),
        catchError(() => of({ id, lab: { nombre: 'Error' } })),
      ),
    );

    return forkJoin(requests).pipe(
      map((results) => {
        results.forEach(({ id, lab }) => {
          this.labCache.set(id, lab);
        });
        return this.labCache;
      }),
    );
  }

  private loadEstados(ids: number[]) {
    const missing = ids.filter((id) => !this.estadoCache.has(id));

    if (missing.length === 0) {
      return of(this.estadoCache);
    }

    const requests = missing.map((id) =>
      this._calendario.getEstado(this.endpointEstado, id).pipe(
        map((estado) => ({ id, estado })),
        catchError(() => of({ id, estado: { estado1: 'Desconocido' } })),
      ),
    );

    return forkJoin(requests).pipe(
      map((results) => {
        results.forEach(({ id, estado }) => {
          this.estadoCache.set(id, estado);
        });
        return this.estadoCache;
      }),
    );
  }

  private loadUsuarios(ids: number[]) {
    const missing = ids.filter((id) => !this.usuarioCache.has(id));

    if (missing.length === 0) {
      return of(this.usuarioCache);
    }

    const requests = missing.map((id) =>
      this._usuario.obtenerUsuarioId(id).pipe(
        map((usuario) => ({ id, usuario })),
        catchError(() =>
          of({ id, usuario: { nombreUsuario: 'Error', apellidoUsuario: '' } }),
        ),
      ),
    );

    return forkJoin(requests).pipe(
      map((results) => {
        results.forEach(({ id, usuario }) => {
          this.usuarioCache.set(id, usuario);
        });
        return this.usuarioCache;
      }),
    );
  }

  private getColorByEstado(estado: string): string {
    const colores: Record<string, string> = {
      pendiente: '#FFA500',
      aprobado: '#4CAF50',
      rechazado: '#F44336',
      cancelado: '#9E9E9E',
      'en proceso': '#2196F3',
    };
    return colores[estado?.toLowerCase()] || '#757575';
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
      evt.startStr.startsWith(arg.dateStr),
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
        data: { info: detalles },
        width: '30rem',
      });
    } else {
      this._toastr.info('No hay eventos en esta fecha.', 'Información');
    }
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
    this.labCache.clear();
    this.estadoCache.clear();
    this.usuarioCache.clear();
  }
}
