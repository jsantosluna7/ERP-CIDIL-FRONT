import { Component, OnInit, signal } from '@angular/core';
import { ServicioMqttService } from '../../../../../services/loT/servicio-mqtt.service';
import { UiSwitchModule } from 'ngx-ui-switch';
import { IMqttMessage } from 'ngx-mqtt';

@Component({
  selector: 'app-iot-buttons',
  imports: [UiSwitchModule],
  templateUrl: './iot-buttons.component.html',
  styleUrl: './iot-buttons.component.css',
  providers: [ServicioMqttService],
})
export class IotButtonsComponent implements OnInit {
  actuador = signal(false);

  estadoActuador = false;
  estadoReiniciar = false;

  observar = `${process.env['PATH_COMPONENT']}${process.env['OBSERVAR']}`;
  publicar = `${process.env['PATH_COMPONENT']}${process.env['PUBLICAR']}`;

  constructor(private _mqttService: ServicioMqttService) {}

  ngOnInit(): void {
    this._mqttService
      .observarTopico(this.observar)
      .subscribe((message: IMqttMessage) => {
        try {
          const payload = JSON.parse(message.payload.toString());
          console.log(payload)
          this.actuador.set(payload.actuador);
        } catch (error) {
          console.error('Error al parsear el mensaje MQTT:', error);
        }
      });
  }

  public toggleActuador(): void {
    this.estadoActuador = !this.estadoActuador;

    const mensajeActivadoActuador = JSON.stringify({ Actuador: true });
    const mensajeDesactivarActuador = JSON.stringify({ Actuador: false });

    const estado = this.estadoActuador
      ? mensajeActivadoActuador
      : mensajeDesactivarActuador;
    this._mqttService.toggle(this.publicar, estado);
  }

  public toggleReiniciar() {
    this.estadoReiniciar = !this.estadoReiniciar;

    const mensajeActivadoReiniar = JSON.stringify({ Reiniciar: true });
    const mensajeDesactivarReiniar = JSON.stringify({ Reiniciar: false });

    const estado = this.estadoReiniciar
      ? mensajeActivadoReiniar
      : mensajeDesactivarReiniar;
    this._mqttService.toggle(this.publicar, estado);
  }
}
