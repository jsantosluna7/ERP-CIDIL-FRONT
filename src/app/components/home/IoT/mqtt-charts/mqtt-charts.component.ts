import { Component, OnInit, signal } from '@angular/core';
import { ServicioMqttService } from '../../../../services/loT/servicio-mqtt.service';
import { ToastrService } from 'ngx-toastr';
import { IMqttMessage } from 'ngx-mqtt';
import { NgxEchartsDirective } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([GridComponent, CanvasRenderer, LineChart, TitleComponent, LegendComponent]);

@Component({
  selector: 'app-mqtt-charts',
  imports: [NgxEchartsDirective],
  templateUrl: './mqtt-charts.component.html',
  styleUrl: './mqtt-charts.component.css',
  providers: [ServicioMqttService],
})
export class MqttChartsComponent implements OnInit {
  temp = signal('---');
  hum = signal('---');
  luz = signal('---');
  sonido = signal('---');

  chartOptionsTemp = this.createBaseOptions('Temperatura', 'Tiempo', '°C');
  chartOptionsHum = this.createBaseOptions('Humedad', 'Tiempo', '%', 0, 100);
  chartOptionsLuz = this.createBaseOptions('Luz', 'Tiempo', '%', 0, 100);
  chartOptionsSon = this.createBaseOptions('Sonido', 'Tiempo', '%');

  private buffers = {
    temp: [] as [number, number][],
    hum: [] as [number, number][],
    luz: [] as [number, number][],
    sonido: [] as [number, number][],
  };

  private chartInstances: Record<string, any> = {};

  observar = `${process.env['PATH_COMPONENT']}${process.env['OBSERVAR']}`;
  publicar = `${process.env['PATH_COMPONENT']}${process.env['PUBLICAR']}`;

  constructor(
    private _mqttService: ServicioMqttService,
    private _toastr: ToastrService
  ) {}

  createBaseOptions(
    title: string,
    xName: string,
    yName: string,
    min?: number,
    max?: number
  ) {
    return {
      title: { text: title },
      legend: { show: true, orient: 'horizontal', bottom: 0 },
      xAxis: {
        type: 'time',
        name: xName,
        nameLocation: 'middle',
        nameGap: 25,
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        name: yName,
        nameLocation: 'middle',
        nameGap: 40,
        min: min,
        max: max,
      },
      series: [{ name: title, type: 'line', showSymbol: false, data: [] }],
      animation: true,
    };
  }

  onInit(chart: any, key: string) {
    this.chartInstances[key] = chart;
  }

  ngOnInit(): void {
    this._mqttService
      .observarTopico(this.observar)
      .subscribe((message: IMqttMessage) => {
        try {
          const p = JSON.parse(message.payload.toString());
          this.temp.set(p.temp.toString());
          const now = Date.now();
          this.temp.set(p.temp);
          this.hum.set(p.hum);
          this.luz.set(p.luz);
          this.sonido.set(p.sonido);

          this.pushAndUpdate('temp', now, +p.temp);
          this.pushAndUpdate('hum', now, +p.hum);
          this.pushAndUpdate('luz', now, +p.luz);
          this.pushAndUpdate('sonido', now, +p.sonido);
        } catch (error: any) {
          this._toastr.error(error, 'Error al parsear el mensaje MQTT:');
        }
      });
  }

  pushAndUpdate(key: keyof typeof this.buffers, ts: number, value: number) {
    const buf = this.buffers[key];
    buf.push([ts, value]);
    const cutoff = ts - 15 * 60 * 1000;
    const filtered = buf.filter((p) => p[0] >= cutoff);
    this.buffers[key] = filtered;

    const chart = this.chartInstances[key];
    if (chart) {
      chart.setOption({ series: [{ data: filtered }] });
    }
  }
}
