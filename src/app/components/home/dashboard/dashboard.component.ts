import { Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { WidgetComponent } from "../../elements/widget/widget.component";
import { DashboardService } from '../../../services/Dashboard/dashboard.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { wrapGrid } from 'animate-css-grid';
import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { WidgetPanelComponent } from "../../elements/widget/widget-panel/widget-panel.component";

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, WidgetComponent, MatButtonModule, MatIcon, MatMenuModule, CdkDrag , CdkDropList, CdkDropListGroup, WidgetPanelComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [DashboardService]
})
export class DashboardComponent implements OnInit {
  aplicacion = inject(DashboardService);

  abrirWidget = signal(false);

  dashboard = viewChild.required<ElementRef>('dashboard');

  drop(event: CdkDragDrop<number, any>) {

    const { previousContainer, container, item: { data } } = event;
    if (data){
      this.aplicacion.insertarWidgetEnPosicion(data, container.data);
      return;
    }
      this.aplicacion.actualizarPosicionWidget(previousContainer.data, container.data);

  }

  ponerDeVueltaWidget(event: CdkDragDrop<number, any>) {
    const { previousContainer } = event;
    this.aplicacion.eliminarWidget(previousContainer.data);
  }

  ngOnInit() {
    wrapGrid(this.dashboard().nativeElement, { duration: 300 });
  };
}
