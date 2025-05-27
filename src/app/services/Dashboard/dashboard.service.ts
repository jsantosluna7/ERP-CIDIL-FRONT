import { computed, Injectable, signal } from '@angular/core';
import { Widget } from '../../interfaces/widget';
import { MqttComponent } from '../../components/loT/mqtt/mqtt.component';
import { IotWidgetComponent } from '../../components/home/dashboard/all-widget/iot-widget/iot-widget.component';
import { UsersWidgetComponent } from '../../components/home/dashboard/all-widget/users-widget/users-widget.component';

@Injectable()
export class DashboardService {

  widgets = signal<Widget[]>([
    {
      id: 1,
      label: 'Mqtt Widget',
      content: MqttComponent,
      rows: 1,
      columns: 1
    },
    {
      id: 2,
      label: 'IoT Widget',
      content: IotWidgetComponent, // Replace with actual component
      // rows: 2,
      // columns: 2
    },
    {
      id: 3,
      label: 'Users Widget',
      content: UsersWidgetComponent, // Replace with actual component
      // rows: 2,
      // columns: 2
    }
  ]);

  widgetsAnadidos = signal<Widget[]>([]);

  widgetsAAnadir = computed(() => {
    const anadidosIds = this.widgetsAnadidos().map(widget => widget.id);
    return this.widgets().filter(widget => !anadidosIds.includes(widget.id));
  })

  anadirWidget(w: Widget) {
    this.widgetsAnadidos.set([...this.widgetsAnadidos(), { ...w }]);
  }

  actualizarWidget(id: number, widget: Partial<Widget>) {
    const index = this.widgetsAnadidos().findIndex(w => w.id === id);
    if (index !== -1) {
      const nuevosWidgets = [...this.widgetsAnadidos()];
      nuevosWidgets[index] = { ...nuevosWidgets[index], ...widget };
      this.widgetsAnadidos.set(nuevosWidgets);
    }
  }

  moverWidgetALaDerecha(id: number) {
    const index = this.widgetsAnadidos().findIndex(w => w.id === id);
    if (index === this.widgetsAnadidos().length - 1) {
      return;
    }

    const nuevosWidgets = [...this.widgetsAnadidos()];
    [nuevosWidgets[index], nuevosWidgets[index + 1]] = [{ ...nuevosWidgets[index + 1] }, { ...nuevosWidgets[index] }];
    this.widgetsAnadidos.set(nuevosWidgets);
  }

  moverWidgetALaIzquierda(id: number) {
    const index = this.widgetsAnadidos().findIndex(w => w.id === id);
    if (index === 0) {
      return;
    }

    const nuevosWidgets = [...this.widgetsAnadidos()];
    [nuevosWidgets[index], nuevosWidgets[index - 1]] = [{ ...nuevosWidgets[index - 1] }, { ...nuevosWidgets[index] }];
    this.widgetsAnadidos.set(nuevosWidgets);
  }

  eliminarWidget(id: number) {
    this.widgetsAnadidos.set(this.widgetsAnadidos().filter(widget => widget.id !== id));
  }

  constructor() { }
}
