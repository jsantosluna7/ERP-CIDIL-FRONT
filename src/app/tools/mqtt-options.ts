import { IMqttServiceOptions } from 'ngx-mqtt';

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
    hostname: process.env['HOSTNAME'],
    path: process.env['PATH'],
    protocol: 'wss'
}
