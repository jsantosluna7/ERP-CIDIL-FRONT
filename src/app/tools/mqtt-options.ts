import { IMqttServiceOptions } from 'ngx-mqtt';

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
    hostname: process.env['HOSTNAME'],
    port: 9001,
    path: process.env['PATH'],
    protocol: 'ws'
}
