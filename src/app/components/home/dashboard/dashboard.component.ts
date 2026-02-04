import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/Dashboard/dashboard.service';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { DashboardBodyComponent } from './dashboard-body/dashboard-body.component';
import { DatosService } from '../../../services/Datos/datos.service';
import { PisosService } from '../../../services/Pisos/pisos.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatTabsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    NgComponentOutlet,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [DashboardService],
})
export class DashboardComponent {
  panelOpen = true;
  pisoSeleccionado: number = 0;
  mostrarComponente = true;

  constructor(private _piso: PisosService) {}

  cambiarPiso(index: number) {
    this.pisoSeleccionado = index;
    const pisoNumero = index + 1;

    this._piso.setPiso(pisoNumero);
    this._piso.setPisoCalendario(pisoNumero);
    this._piso.setPisoHorario(pisoNumero);
    this._piso.setPisoMqtt(pisoNumero);

    this.mostrarComponente = false;
    setTimeout(() => (this.mostrarComponente = true), 0);
  }

  componente = DashboardBodyComponent;
}
