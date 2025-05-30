import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit, signal} from '@angular/core';
import { ServicioMqttService } from '../../../services/loT/servicio-mqtt.service';
import { IMqttMessage, MqttService } from 'ngx-mqtt';

@Component({
  selector: 'app-mqtt',
  imports: [CommonModule],
  templateUrl: './mqtt.component.html',
  styleUrl: './mqtt.component.css',
  providers: [ServicioMqttService]
})
export class MqttComponent implements OnInit{
  // datos = signal('');
  temp = signal('---');
  hum = signal('---');
  luz = signal('---');
  sonido = signal('---');
  actuador = signal(false);
  
  estadoActuador = false;
  estadoReiniciar = false;

  constructor(private _mqttService: ServicioMqttService){}

  ngOnInit(): void {
    this._mqttService.observarTopico('Lab/1B/data').subscribe((message: IMqttMessage) =>{
      try {
        const payload = JSON.parse(message.payload.toString());
      this.temp.set(payload.temp.toString());
      this.hum.set(payload.hum.toString());
      this.luz.set(payload.luz.toString());
      this.sonido.set(payload.sonido.toString());
      this.actuador.set(payload.actuador.toString());
      } catch (error) {
        console.error('Error al parsear el mensaje MQTT:', error);
      }
    })
  }

    public toggleActuador(): void{
    this.estadoActuador = !this.estadoActuador

    const mensajeActivadoActuador = JSON.stringify({ Actuador: true });
    const mensajeDesactivarActuador = JSON.stringify({ Actuador: false });

    const estado = this.estadoActuador ? mensajeActivadoActuador : mensajeDesactivarActuador;
    this._mqttService.toggle('Lab/1B/action', estado)
  }

    public toggleReiniciar(){
    this.estadoReiniciar = !this.estadoReiniciar

    const mensajeActivadoReiniar = JSON.stringify({ Reiniciar: true });
    const mensajeDesactivarReiniar = JSON.stringify({ Reiniciar: false });

    const estado = this.estadoReiniciar ? mensajeActivadoReiniar : mensajeDesactivarReiniar;
    this._mqttService.toggle('Lab/1B/action', estado)
  }

}
