import { Component, OnInit, signal } from '@angular/core';
import { ServicioMqttService } from '../../../../../services/loT/servicio-mqtt.service';
import { UiSwitchModule } from 'ngx-ui-switch';
import { IMqttMessage } from 'ngx-mqtt';
import { DatosService } from '../../../../../services/Datos/datos.service';
import { MatDialog } from '@angular/material/dialog';
import { TimerDialogComponent } from './timer-dialog/timer-dialog.component';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private _mqttService: ServicioMqttService,
    private _data: DatosService,
    private _dialog: MatDialog,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this._mqttService
      .observarTopico(this.observar)
      .subscribe((message: IMqttMessage) => {
        try {
          const payload = JSON.parse(message.payload.toString());
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

    if (this.estadoActuador) {
      this._mqttService.toggle(this.publicar, mensajeActivadoActuador);
    }

    if (!this.estadoActuador) {
      const dialogRef = this._dialog.open(TimerDialogComponent, {
        data: {
          titulo: 'Introduce los minutos',
        },
      });

      dialogRef.afterClosed().subscribe({
        next: (n) => {
          if (n) {
            this._data.timerData$.subscribe({
              next: (timer: any) => {
                setTimeout(() => {
                  console.log('Se acciono el timer');
                  this._mqttService.toggle(
                    this.publicar,
                    mensajeDesactivarActuador
                  );
                }, timer.segundos);
              },
            });
          }
        },
        error: (err) => {
          this._toastr.error(err.error, 'Hubo un error');
        },
      });
    }
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
