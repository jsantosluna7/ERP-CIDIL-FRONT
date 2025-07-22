import {
  Component,
  ElementRef,
  inject,
  input,
  Input,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { WidgetComponent } from '../../../elements/widget/widget.component';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { WidgetPanelComponent } from '../../../elements/widget/widget-panel/widget-panel.component';
import { DashboardService } from '../../../../services/Dashboard/dashboard.service';
import { wrapGrid } from 'animate-css-grid';
import { Console } from 'console';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { AnaliticaComponent } from '../all-widget/analitica/analitica.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendarCheck, faMicrochip, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import { AnaliticaTodaComponent } from "../all-widget/analitica/analitica-toda/analitica-toda.component";
import { CalendarioComponent } from "../all-widget/calendario/calendario.component";

@Component({
  selector: 'app-dashboard-body',
  imports: [
    MatMenuModule,
    FontAwesomeModule,
    AnaliticaComponent,
    CalendarioComponent
],
  templateUrl: './dashboard-body.component.html',
  styleUrl: './dashboard-body.component.css',
  providers: [DashboardService],
  encapsulation: ViewEncapsulation.None
})
export class DashboardBodyComponent {
  faCalendar = faCalendarCheck
  faGroup = faPeopleGroup
  faElectronics = faMicrochip
}
