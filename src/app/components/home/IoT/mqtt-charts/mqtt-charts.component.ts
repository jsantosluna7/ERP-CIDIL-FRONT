import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ServicioMqttService } from '../../../../services/loT/servicio-mqtt.service';
import { ToastrService } from 'ngx-toastr';
import { IMqttMessage } from 'ngx-mqtt';
import { NgxEchartsDirective } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { DatosService } from '../../../../services/Datos/datos.service';
import { Subscription } from 'rxjs';
import { PisosService } from '../../../../services/Pisos/pisos.service';
echarts.use([
  GridComponent,
  CanvasRenderer,
  LineChart,
  TitleComponent,
  LegendComponent,
]);

@Component({
  selector: 'app-mqtt-charts',
  imports: [NgxEchartsDirective],
  templateUrl: './mqtt-charts.component.html',
  styleUrl: './mqtt-charts.component.css',
  providers: [ServicioMqttService],
})
export class MqttChartsComponent implements OnInit, OnDestroy {
  temp = signal('---');
  hum = signal('---');
  luz = signal('---');
  sonido = signal('---');

  chartOptionsTemp = this.createBaseOptions('Temperatura', 'Tiempo', '°C');
  chartOptionsHum = this.createBaseOptions('Humedad', 'Tiempo', '%', 0, 100);
  chartOptionsLuz = this.createBaseOptions('Luz', 'Tiempo', '%', 0, 100);
  chartOptionsSon = this.createBaseOptions('Sonido', 'Tiempo', '%');

  private subs: Subscription[] = [];

  private buffers = {
    temp: new Map<string, [number, number][]>(),
    hum: new Map<string, [number, number][]>(),
    luz: new Map<string, [number, number][]>(),
    sonido: new Map<string, [number, number][]>(),
  };

  private chartInstances: Record<string, any> = {};

  path: string = `${process.env['PATH_COMPONENT']}`;
  observar: string = `${process.env['OBSERVAR']}`;
  publicar: string = `${process.env['PUBLICAR']}`;

  constructor(
    private _mqttService: ServicioMqttService,
    private _toastr: ToastrService,
    private _piso: PisosService
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
      series: [],
      animation: true,
    };
  }

  onInit(chart: any, key: string) {
    this.chartInstances[key] = chart;
  }

  ngOnInit(): void {
    this._piso.tabListMqtt$.subscribe({
      next: (labs) => {
        // Cancelar subscripciones anteriores
        this.subs.forEach((s) => s.unsubscribe());
        this.subs = [];

        // Limpiar buffers y gráficos
        for (const sensor of Object.keys(this.buffers)) {
          this.buffers[sensor as keyof typeof this.buffers] = new Map();
          const chart = this.chartInstances[sensor];
          if (chart) {
            chart.setOption({ series: [], legend: { data: [] } });
          }
        }

        labs.forEach((lab) => {
          const sub = this._mqttService
            .observarTopico(`${this.path}${lab}${this.observar}`)
            .subscribe((message: IMqttMessage) => {
              try {
                const p = JSON.parse(message.payload.toString());
                const now = Date.now();
                this.temp.set(p.temp);
                this.hum.set(p.hum);
                this.luz.set(p.luz);
                this.sonido.set(p.sonido);

                this.pushAndUpdate('temp', lab, now, +p.temp);
                this.pushAndUpdate('hum', lab, now, +p.hum);
                this.pushAndUpdate('luz', lab, now, +p.luz);
                this.pushAndUpdate('sonido', lab, now, +p.sonido);
              } catch (error: any) {
                this._toastr.error(error, 'Error al parsear el mensaje MQTT:');
              }
            });
          this.subs.push(sub);
        });
      },
      error: (err) => {
        this._toastr.error(
          'Error al obtener lista de laboratorios',
          'Hubo un error'
        );
      },
    });
  }

  pushAndUpdate(
    sensor: keyof typeof this.buffers,
    lab: string,
    ts: number,
    value: number
  ) {
    const map = this.buffers[sensor];

    if (!map.has(lab)) {
      map.set(lab, []);
    }

    const buf = map.get(lab)!;
    buf.push([ts, value]);

    // Mantener solo los últimos 15 minutos
    const cutoff = ts - 15 * 60 * 1000;
    const filtered = buf.filter((p) => p[0] >= cutoff);
    map.set(lab, filtered);

    // Actualizar chart
    const chart = this.chartInstances[sensor];
    if (chart) {
      const series = Array.from(map.entries()).map(([labName, data]) => ({
        name: labName,
        type: 'line',
        showSymbol: false,
        data,
      }));

      chart.setOption({
        series,
        legend: {
          data: Array.from(map.keys()),
        },
      });
    }
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
