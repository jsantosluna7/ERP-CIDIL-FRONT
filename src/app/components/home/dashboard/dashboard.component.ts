import { Component, inject } from '@angular/core';
import { WidgetComponent } from "../../elements/widget/widget.component";
import { DashboardService } from '../../../services/Dashboard/dashboard.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, WidgetComponent, MatButtonModule, MatIcon, MatMenuModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [DashboardService]
})
export class DashboardComponent {
  aplicacion = inject(DashboardService);
}
