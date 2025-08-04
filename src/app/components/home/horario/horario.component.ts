import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
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
import { CalendarComponent } from "./calendar/calendar.component";

@Component({
  selector: 'app-horario',
  imports: [
    CommonModule,
    MatTabsModule,
    HorarioTableComponent,
    FullCalendarModule,
    CalendarComponent
],
  templateUrl: './horario.component.html',
  styleUrl: './horario.component.css',
})
export class HorarioComponent implements OnInit {
  loadedHorarioTab = false;

  constructor(
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadedHorarioTab = true;
  }
}
