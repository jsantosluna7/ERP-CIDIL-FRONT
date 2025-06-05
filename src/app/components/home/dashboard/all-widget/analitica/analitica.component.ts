import { Component, OnInit, signal } from '@angular/core';
import { NgxGaugeModule } from 'ngx-gauge';
import { ServicioMqttService } from '../../../../../services/loT/servicio-mqtt.service';
import { IMqttMessage } from 'ngx-mqtt';

@Component({
  selector: 'app-analitica',
  imports: [NgxGaugeModule],
  templateUrl: './analitica.component.html',
  styleUrl: './analitica.component.css',
  providers: [ServicioMqttService]
})
export class AnaliticaComponent implements OnInit {

  // GAUGE CONFIG
  gaugeType: any = "arch";
  gaugeCap: any = "round";
  gaugeThick: any = 18;


  temp: any = signal('---');
  hum: any = signal('---');
  luz:any = signal('---');
  sonido:any = signal('---');

  observar = `${process.env['PATH_COMPONENT']}${process.env['OBSERVAR']}`;

  constructor(private _mqttService: ServicioMqttService){}

  ngOnInit() {
    this._mqttService
      .observarTopico(this.observar)
      .subscribe((message: IMqttMessage) => {
        try {
          const payload = JSON.parse(message.payload.toString());
          this.temp.set(payload.temp.toString());
          this.hum.set(payload.hum.toString());
          this.luz.set(payload.luz.toString());
          this.sonido.set(payload.sonido.toString());
        } catch (error) {
          console.error('Error al parsear el mensaje MQTT:', error);
        }
      });
  }
}
