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
import { NgComponentOutlet } from '@angular/common';
import { AnaliticaComponent } from '../all-widget/analitica/analitica.component';

@Component({
  selector: 'app-dashboard-body',
  imports: [
    WidgetComponent,
    MatIcon,
    MatMenuModule,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    WidgetPanelComponent,
  ],
  templateUrl: './dashboard-body.component.html',
  styleUrl: './dashboard-body.component.css',
  providers: [DashboardService],
  encapsulation: ViewEncapsulation.None
})
export class DashboardBodyComponent {
  aplicacion = inject(DashboardService);
  abrirWidget = signal(false);

  dashboard = viewChild.required<ElementRef>('dashboard');

  drop(event: CdkDragDrop<number, any>) {
    const {
      previousContainer,
      container,
      item: { data },
    } = event;
    if (data) {
      this.aplicacion.insertarWidgetEnPosicion(data, container.data);
      return;
    }
    this.aplicacion.actualizarPosicionWidget(
      previousContainer.data,
      container.data
    );
  }

  ponerDeVueltaWidget(event: CdkDragDrop<number, any>) {
    const { previousContainer } = event;
    this.aplicacion.eliminarWidget(previousContainer.data);
  }

  ngOnInit() {
    wrapGrid(this.dashboard().nativeElement, { duration: 300 });
  }
}
