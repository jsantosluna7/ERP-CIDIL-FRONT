import { Component, inject, input, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Widget } from '../../../../interfaces/widget';
import { DashboardService } from '../../../../services/Dashboard/dashboard.service';

@Component({
  selector: 'app-widget-options',
  imports: [MatButtonModule, MatIcon, MatButtonToggleModule],
  templateUrl: './widget-options.component.html',
  styleUrl: './widget-options.component.css',
  // providers: [DashboardService]
})
export class WidgetOptionsComponent {

  data = input.required<Widget>();

  mostrarOpciones = model<boolean>(false);

  aplicacion = inject(DashboardService);

}
