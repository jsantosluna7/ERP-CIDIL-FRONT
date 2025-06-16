import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideToastr } from 'ngx-toastr';
import { MqttModule } from 'ngx-mqtt';
import { MQTT_SERVICE_OPTIONS } from './tools/mqtt-options';
import { provideHttpClient } from '@angular/common/http';
import { UiSwitchModule } from 'ngx-ui-switch';
import * as echarts from 'echarts/core';
import { provideEchartsCore } from 'ngx-echarts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true,
      progressAnimation: 'increasing',
    }),
    importProvidersFrom(MqttModule.forRoot(MQTT_SERVICE_OPTIONS)),
    provideHttpClient(),
    importProvidersFrom(
      UiSwitchModule.forRoot({
        size: 'large',
        color: '#F0F0F0',
        switchColor: '#1825AA',
        defaultBoColor: '#fff',
        checkedLabel: 'Encendido',
        uncheckedLabel: 'Apagado',
      })
    ),
    provideEchartsCore({ echarts })
  ],
};
