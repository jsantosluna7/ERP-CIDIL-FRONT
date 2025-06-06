import { computed, effect, Injectable, signal } from '@angular/core';
import { Widget } from '../../interfaces/widget';
import { UsersWidgetComponent } from '../../components/home/dashboard/all-widget/users-widget/users-widget.component';
import { AnaliticaComponent } from '../../components/home/dashboard/all-widget/analitica/analitica.component';
import { CalendarioComponent } from '../../components/home/dashboard/all-widget/calendario/calendario.component';
import { IotButtonsComponent } from '../../components/home/dashboard/all-widget/iot-buttons/iot-buttons.component';

@Injectable()
export class DashboardService {

  widgets = signal<Widget[]>([
    {
      id: 1,
      label: 'IoT Analitica',
      content: AnaliticaComponent, // Replace with actual component
      rows: 2,
      columns: 2
    },
    {
      id: 2,
      label: 'Users Widget',
      content: UsersWidgetComponent, // Replace with actual component
      rows: 2,
      columns: 2
    },
    {
      id: 3,
      label: 'IoT Botones',
      content: IotButtonsComponent, // Replace with actual component
      rows: 2,
      columns: 2
    },
    {
      id: 4,
      label: 'Calendario',
      content: CalendarioComponent, // Replace with actual component
      rows: 2,
      columns: 2
    },
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

      document.startViewTransition(() => {
        this.widgetsAnadidos.set(nuevosWidgets);
      })
    }
  }

  moverWidgetALaDerecha(id: number) {
    const index = this.widgetsAnadidos().findIndex(w => w.id === id);
    if (index === this.widgetsAnadidos().length - 1) {
      return;
    }

    const nuevosWidgets = [...this.widgetsAnadidos()];
    [nuevosWidgets[index], nuevosWidgets[index + 1]] = [{ ...nuevosWidgets[index + 1] }, { ...nuevosWidgets[index] }];
    document.startViewTransition(() => {
      this.widgetsAnadidos.set(nuevosWidgets);
    })
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

  actualizarPosicionWidget(sourceWidgetId: number, targetWidgetId: number) {
    const sourceIndex = this.widgetsAnadidos().findIndex(w => w.id === sourceWidgetId);
    if (sourceIndex === -1) {
      return;
    }
    const nuevosWidgets = [...this.widgetsAnadidos()];
    const sourceWidget = nuevosWidgets.splice(sourceIndex, 1)[0];

    const targetIndex = nuevosWidgets.findIndex(w => w.id === targetWidgetId);
    if (targetIndex === -1) {
      return;
    }

    const anadirAlFinal = targetIndex === sourceIndex ? targetIndex + 1 : targetIndex;

    nuevosWidgets.splice(anadirAlFinal, 0, sourceWidget);

    // Utilizar startViewTransition para animar la actualización
    document.startViewTransition(() => {
      this.widgetsAnadidos.set(nuevosWidgets);
    });
  }


  fetchWidgets() {
    const widgetsComoString = localStorage.getItem('dashboardWidgets');
    if (widgetsComoString) {
      const widgets = JSON.parse(widgetsComoString) as Widget[];
      widgets.forEach(widget => {
        const content = this.widgets().find(w => w.id === widget.id)?.content;
        if (content) {
          widget.content = content;
        }
      })

      this.widgetsAnadidos.set(widgets);
    }
  }

  constructor() {
    this.fetchWidgets();
  }

  insertarWidgetEnPosicion(sourceWidgetId: number, destWidgetId: number) {
    const widgetAAnadir = this.widgetsAAnadir().find(w => w.id === sourceWidgetId);
    if (!widgetAAnadir) {
      return;

    }

    const indexDeDestinoWidget = this.widgetsAnadidos().findIndex(w => w.id === destWidgetId);
    const posicionAAnadir = indexDeDestinoWidget === -1 ? this.widgetsAnadidos().length : indexDeDestinoWidget;

    const nuevosWidgets = [...this.widgetsAnadidos()];
    nuevosWidgets.splice(posicionAAnadir, 0, widgetAAnadir);
    document.startViewTransition(() => {
      this.widgetsAnadidos.set(nuevosWidgets);
    });
  }

  guardarWidgets = effect(() => {
    const widgetsSinContenido: Partial<Widget>[] = this.widgetsAnadidos().map(widget => ({ ...widget }));
    widgetsSinContenido.forEach(w => {
      delete w.content;
    });

    localStorage.setItem('dashboardWidgets', JSON.stringify(widgetsSinContenido));
  })
}
