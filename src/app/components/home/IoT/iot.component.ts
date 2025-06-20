import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MqttChartsComponent } from './mqtt-charts/mqtt-charts.component';
import { MqttTableComponent } from './mqtt-table/mqtt-table.component';
import { ServicioMqttService } from '../../../services/loT/servicio-mqtt.service';

@Component({
  selector: 'app-iot',
  imports: [
    CommonModule,
    MatTabsModule,
    MqttChartsComponent,
    MqttTableComponent,
  ],
  templateUrl: './iot.component.html',
  styleUrl: './iot.component.css',
  providers: [ServicioMqttService],
})
export class IotComponent implements OnInit {
  loadedChartsTab = false;

  constructor(public _tab: ServicioMqttService) {}

  ngOnInit(): void {
    this.loadedChartsTab = true;
  }

  onTabChange(idx: number) {
    if (idx === 0) {
      this.loadedChartsTab = true;
    }
  }
}
