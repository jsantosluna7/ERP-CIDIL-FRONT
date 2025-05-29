import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Observable } from 'rxjs';

@Injectable()
export class ServicioMqttService {

    constructor(private _mqttService: MqttService) {}

    observarTopico(topic: string): Observable<IMqttMessage> {
        return this._mqttService.observe(topic);
    }

    toggle(topic: string, message: string):void {
      return this._mqttService.unsafePublish(topic, message);
    }
}
