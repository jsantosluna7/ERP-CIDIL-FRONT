import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatosService } from '../../../../services/Datos/datos.service';
import { MqttChartsComponent } from '../mqtt-charts/mqtt-charts.component';
import { PisosService } from '../../../../services/Pisos/pisos.service';

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
  pisoSeleccionado: number = 0;
  mostrarComponente = true;

  constructor(private _piso: PisosService) {}

  cambiarPiso(index: number) {
    this.pisoSeleccionado = index;
    switch (index) {
      case 0:
        this._piso.setPisoMqtt(1);
        break;
      case 1:
        this._piso.setPisoMqtt(2);
        break;
      case 2:
        this._piso.setPisoMqtt(3);
        break;
      case 3:
        this._piso.setPisoMqtt(4);
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
