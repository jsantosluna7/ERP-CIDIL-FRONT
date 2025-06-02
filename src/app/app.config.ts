import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideToastr } from 'ngx-toastr';
import { MqttModule } from 'ngx-mqtt';
import { MQTT_SERVICE_OPTIONS } from './tools/mqtt-options';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withViewTransitions()), 
    provideAnimations(), 
    provideToastr(),
    importProvidersFrom(MqttModule.forRoot(MQTT_SERVICE_OPTIONS)),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar:true,
      progressAnimation:'increasing',
      
    })
  ]
};
