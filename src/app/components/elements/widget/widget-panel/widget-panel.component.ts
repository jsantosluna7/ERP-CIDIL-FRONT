import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DashboardService } from '../../../../services/Dashboard/dashboard.service';
import { CdkDrag, CdkDragPlaceholder } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-widget-panel',
  imports: [MatIconModule, CdkDrag, CdkDragPlaceholder],
  templateUrl: './widget-panel.component.html',
  styleUrl: './widget-panel.component.css'
})
export class WidgetPanelComponent {
  aplicacion = inject(DashboardService);
}
