import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatosService } from '../../../../services/Datos/datos.service';
import { MqttChartsComponent } from '../mqtt-charts/mqtt-charts.component';

@Component({
  selector: 'app-mqtt-labs',
  imports: [
    CommonModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MqttChartsComponent,
  ],
  templateUrl: './mqtt-labs.component.html',
  styleUrl: './mqtt-labs.component.css',
})
export class MqttLabsComponent {
  panelOpen = true;
  listaDeLabs1erPiso: string[] = ['1A', '1B', '1C', '1D'];
  listaDeLabs2doPiso: string[] = ['2A', '2B', '2C', '2D'];
  listaDeLabs3erPiso: string[] = ['3A', '3B', '3C', '3D'];
  listaDeLabsTodo: string[] = [
    '1A',
    '1B',
    '1C',
    '1D',
    '2A',
    '2B',
    '2C',
    '2D',
    '3A',
    '3B',
    '3C',
    '3D',
  ];

  pisoSeleccionado: number = 0; // 0 = 1er piso, 1 = 2do piso...
  mostrarComponente = true;

  constructor(private _datos: DatosService) {
    _datos.actualizarTabListMqtt(this.listaDeLabs1erPiso);
  }

  cambiarPiso(index: number) {
    this.pisoSeleccionado = index;
    switch (index) {
      case 0:
        this._datos.obtenerPisoMqtt(1);
        this._datos.actualizarTabListMqtt(this.listaDeLabs1erPiso);
        break;
      case 1:
        this._datos.obtenerPisoMqtt(2);
        this._datos.actualizarTabListMqtt(this.listaDeLabs2doPiso);
        break;
      case 2:
        this._datos.obtenerPisoMqtt(3);
        this._datos.actualizarTabListMqtt(this.listaDeLabs3erPiso);
        break;
      case 3:
        this._datos.obtenerPisoMqtt(4);
        this._datos.actualizarTabListMqtt(this.listaDeLabsTodo);
        break;
    }

    // 🔁 Forzar la recreación del componente
    this.mostrarComponente = false;
    setTimeout(() => {
      this.mostrarComponente = true;
    }, 0);
    // this._datos.actualizarLabAnalitica(this.tabList[0]);
  }
}
