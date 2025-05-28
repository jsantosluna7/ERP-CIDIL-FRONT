import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { ServicioMqttService } from '../../../services/loT/servicio-mqtt.service';
import { IMqttMessage } from 'ngx-mqtt';

@Component({
  selector: 'app-mqtt',
  imports: [CommonModule],
  templateUrl: './mqtt.component.html',
  styleUrl: './mqtt.component.css'
})
export class MqttComponent implements OnInit{
  datos: any;

  constructor(private _mqttService: ServicioMqttService){}

  ngOnInit(): void {
    this._mqttService.observarTopico('Laboratorios/1B').subscribe((message: IMqttMessage) =>{
      console.log(message.payload.toString());
      this.datos = message.payload.toString();
    })
  }

}
