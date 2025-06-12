import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ServicioMqttService } from '../../../services/loT/servicio-mqtt.service';
import { IMqttMessage } from 'ngx-mqtt';
import { ToastrService } from 'ngx-toastr';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EChartsCoreOption } from 'echarts/core';
echarts.use([BarChart, GridComponent, CanvasRenderer]);

@Component({
  selector: 'app-mqtt',
  imports: [CommonModule, NgxEchartsDirective],
  templateUrl: './mqtt.component.html',
  styleUrl: './mqtt.component.css',
  providers: [ServicioMqttService, provideEchartsCore({ echarts })],
})
export class MqttComponent implements OnInit {
  temp = signal('---');
  hum = signal('---');
  luz = signal('---');
  sonido = signal('---');

  observar = `${process.env['PATH_COMPONENT']}${process.env['OBSERVAR']}`;
  publicar = `${process.env['PATH_COMPONENT']}${process.env['PUBLICAR']}`;

  constructor(
    private _mqttService: ServicioMqttService,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this._mqttService
      .observarTopico(this.observar)
      .subscribe((message: IMqttMessage) => {
        try {
          const payload = JSON.parse(message.payload.toString());
          this.temp.set(payload.temp.toString());
          this.hum.set(payload.hum.toString());
          this.luz.set(payload.luz.toString());
          this.sonido.set(payload.sonido.toString());
        } catch (error: any) {
          this._toastr.error(error, 'Error al parsear el mensaje MQTT:');
        }
      });
  }

  chartOption: EChartsCoreOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
      },
    ],
  };
}
