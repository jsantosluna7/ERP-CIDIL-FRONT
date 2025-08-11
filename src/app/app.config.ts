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
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { UiSwitchModule } from 'ngx-ui-switch';
import * as echarts from 'echarts/core';
import { provideEchartsCore } from 'ngx-echarts';
import {provideNativeDateAdapter} from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { tokenInterceptor } from './interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideAnimations(),
    provideToastr({
      timeOut: 6000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true,
      progressAnimation: 'increasing',
    }),
    importProvidersFrom(MqttModule.forRoot(MQTT_SERVICE_OPTIONS)),
    provideHttpClient(withInterceptors([tokenInterceptor])),
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
    provideEchartsCore({ echarts }),
    provideNativeDateAdapter(),
    DatePipe,
  ],
};
