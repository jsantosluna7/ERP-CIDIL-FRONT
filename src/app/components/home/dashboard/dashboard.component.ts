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
  listaDeLabs1erPiso: string[] = ['1A', '1B', '1C', '1D'];
  listaDeLabs2doPiso: string[] = ['2A', '2B', '2C', '2D'];
  listaDeLabs3erPiso: string[] = ['3A', '3B', '3C', '3D'];
  listaDeLabsTodo: string[] = [];

  pisoSeleccionado: number = 0; // 0 = 1er piso, 1 = 2do piso...
  tabList: string[] = this.listaDeLabs1erPiso;
  mostrarComponente = true;

  constructor(private _datos: DatosService) {
    _datos.actualizarTabList(this.listaDeLabs1erPiso);
  }

  cambiarPiso(index: number) {
    this.pisoSeleccionado = index;
    switch (index) {
      case 0:
        this._datos.actualizarTabList(this.listaDeLabs1erPiso);
        console.log(this.listaDeLabs1erPiso);
        this.tabList = this.listaDeLabs1erPiso;
        break;
      case 1:
        this._datos.actualizarTabList(this.listaDeLabs2doPiso);
        console.log(this.listaDeLabs2doPiso);
        this.tabList = this.listaDeLabs2doPiso;
        break;
      case 2:
        this._datos.actualizarTabList(this.listaDeLabs3erPiso);
        this.tabList = this.listaDeLabs3erPiso;
        break;
      case 3:
        this._datos.actualizarTabList(this.listaDeLabsTodo);
        this.tabList = this.listaDeLabsTodo;
        break;
    }

    // 🔁 Forzar la recreación del componente
    this.mostrarComponente = false;
    setTimeout(() => {
      this.mostrarComponente = true;
    }, 0);
    // this._datos.actualizarLabAnalitica(this.tabList[0]);
  }

  componente = DashboardBodyComponent;
}
