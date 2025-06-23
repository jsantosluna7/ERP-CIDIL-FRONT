import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HorarioTableComponent } from './horario-table/horario-table/horario-table.component';
import { CommonModule } from '@angular/common';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, map, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UtilitiesService } from '../../../services/Utilities/utilities.service';
import { HorarioService } from '../../../services/Api/Horario/horario.service';
import { LaboratorioService } from '../../../services/Api/Laboratorio/laboratorio.service';
import { DateHorarioDialogComponent } from './calendar/date-horario-dialog/date-horario-dialog/date-horario-dialog.component';
import { EventHorarioDialogComponent } from './calendar/event-horario-dialog/event-horario-dialog/event-horario-dialog.component';

@Component({
  selector: 'app-horario',
  imports: [
    CommonModule,
    MatTabsModule,
    HorarioTableComponent,
    FullCalendarModule,
  ],
  templateUrl: './horario.component.html',
  styleUrl: './horario.component.css',
})
export class HorarioComponent implements OnInit {
  loadedHorarioTab = false;
  @ViewChild('horarioCalendar', { static: true })
  host!: ElementRef<HTMLDivElement>;
  @ViewChild('hc') calendarComponent!: FullCalendarComponent;
  opcionesCalendario: CalendarOptions;

  endpoint: string = `${process.env['API_URL']}${process.env['ENDPOINT_HORARIO_TODOS']}`;
  endpointLab: string = `${process.env['API_URL']}${process.env['ENDPOINT_LABORATORIO']}`;
  endpointEstado: string = `${process.env['API_URL']}${process.env['ENDPOINT_ESTADO']}`;

  constructor(
    private _toastr: ToastrService,
    private _horario: HorarioService,
    private _lab: LaboratorioService,
    public dialog: MatDialog,
    private _utilities: UtilitiesService
  ) {
    this.opcionesCalendario = {
      initialView: 'dayGridMonth',
      events: this.fetchEventos.bind(this),
      eventClick: this.handleEventClick.bind(this),
      dateClick: this.handleDateClick.bind(this),
      locales: [esLocale],
      locale: 'es',
      plugins: [dayGridPlugin, interactionPlugin],
      height: '100%',
      contentHeight: 'auto',
    };
  }

  ngOnInit(): void {
    this.loadedHorarioTab = true;
  }

  onTabChange(ev: MatTabChangeEvent) {
    if (ev.index === 0) {
      // si el calendario está en la primera pestaña
      setTimeout(() => {
        this.calendarComponent.getApi().render();
        this.calendarComponent.getApi().updateSize();
      }, 0);
    }
  }

  fetchEventos(info: any, successCallback: any, failureCallback: any) {
    this._horario
      .getHorarioCalendario(this.endpoint, {
        params: {
          start: info.startStr,
          end: info.endStr,
        },
      })
      .subscribe({
        next: (data: any) => {
          console.log(data);

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
                lab: this._lab.getLabById(this.endpointLab, e.idLaboratorio),
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
                      horaInicio: this._utilities.formatearHora(e.horaInicio),
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
            .filter((obs: any) => obs !== null) as Observable<any>[];

          forkJoin(observables).subscribe(
            (events) => {
              successCallback(events);
            },
            (err) => failureCallback(err)
          );
        },
        error: (err) => failureCallback(err),
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

      console.log(seleccionados);

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
}
