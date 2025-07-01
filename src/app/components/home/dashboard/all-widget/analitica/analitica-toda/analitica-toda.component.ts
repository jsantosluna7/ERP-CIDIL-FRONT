import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { NgxGaugeModule } from 'ngx-gauge';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, Subscription, timeout } from 'rxjs';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ServicioMqttService } from '../../../../../../services/loT/servicio-mqtt.service';
import { DatosService } from '../../../../../../services/Datos/datos.service';

@Component({
  selector: 'app-analitica-toda',
  imports: [NgxGaugeModule, UiSwitchModule],
  templateUrl: './analitica-toda.component.html',
  styleUrl: './analitica-toda.component.css',
  providers: [ServicioMqttService],
})
export class AnaliticaTodaComponent implements OnInit, OnDestroy {
  // GAUGE CONFIG
  gaugeType: any = 'arch';
  gaugeCap: any = 'round';
  gaugeThick: any = 18;
  @Input() laboratorio: string = '1A';

  temp: any = signal('---');
  hum: any = signal('---');
  luz: any = signal('---');
  sonido: any = signal('---');

  actuador = signal(false);

  estadoActuador = false;
  estadoReiniciar = false;
  lab = '';

  private subscription: Subscription | null = null;
  private mqttSubscription: Subscription | null = null;

  private subscriptionBtn: Subscription | null = null;
  private mqttSubscriptionBtn: Subscription | null = null;

  path: string = `${process.env['PATH_COMPONENT']}`;
  observar: string = `${process.env['OBSERVAR']}`;
  publicar: string = `${process.env['PUBLICAR']}`;

  constructor(
    private _mqttService: ServicioMqttService,
    private _datos: DatosService,
    private _toastr: ToastrService
  ) {}

  ngOnInit() {
    const topico = `${this.path}${this.laboratorio}${this.observar}`;
    console.log(topico);

    try {
      this._mqttService.observarTopico(topico).subscribe({
        next: (e) => {
          const payload = JSON.parse(e.payload.toString());
          this.temp.set(payload.temp.toString() ?? '---');
          this.hum.set(payload.hum.toString() ?? '---');
          this.luz.set(payload.luz.toString() ?? '---');
          this.sonido.set(payload.sonido.toString() ?? '---');
        },
      });
    } catch (error) {
      this.temp.set('---');
      this.hum.set('---');
      this.luz.set('---');
      this.sonido.set('---');
      this._toastr.error(
        `No existe o no hay datos en el laboratorio ${this.laboratorio}`,
        'Error'
      );
    }

    this.lab = this.laboratorio;

    const topicoBtn = `${this.path}${this.laboratorio}${this.observar}`;

    try {
      this._mqttService.observarTopico(topicoBtn).subscribe({
        next: (e) => {
          const payload = JSON.parse(e.payload.toString());

          this.actuador.set(payload.actuador);
        },
      });
    } catch (error) {
      this.actuador.set(false);
      this._toastr.error(
        `No existe o no hay actuador en el laboratorio ${this.laboratorio}`,
        'Error'
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.mqttSubscription?.unsubscribe();
  }
  public toggleActuador(): void {
    this.estadoActuador = !this.estadoActuador;

    const mensajeActivadoActuador = JSON.stringify({ Actuador: true });
    const mensajeDesactivarActuador = JSON.stringify({ Actuador: false });

    const estado = this.estadoActuador
      ? mensajeActivadoActuador
      : mensajeDesactivarActuador;
    this._mqttService.toggle(`${this.path}${this.lab}${this.publicar}`, estado);

    // if (this.estadoActuador) {
    //   this._mqttService.toggle(this.publicar, mensajeActivadoActuador);
    // }

    // if (!this.estadoActuador) {
    //   this._mqttService.toggle(this.publicar, mensajeDesactivarActuador);
    //   const dialogRef = this._dialog.open(TimerDialogComponent, {
    //     data: {
    //       titulo: 'Introduce los minutos',
    //     },
    //   });

    //   dialogRef.afterClosed().pipe(take(1)).subscribe({
    //     next: (n) => {
    //       if (n) {
    //         this._data.timerData$.subscribe({
    //           next: (timer: any) => {
    //             setTimeout(() => {
    //               console.log('Se acciono el timer');
    //               this._mqttService.toggle(
    //                 this.publicar,
    //                 mensajeDesactivarActuador
    //               );
    //             }, timer.segundos);
    //           },
    //         });
    //       }
    //     },
    //     error: (err) => {
    //       this._toastr.error(err.error, 'Hubo un error');
    //     },
    //   });
    // }
  }

  public toggleReiniciar() {
    this.estadoReiniciar = !this.estadoReiniciar;

    const mensajeActivadoReiniar = JSON.stringify({ Reiniciar: true });
    const mensajeDesactivarReiniar = JSON.stringify({ Reiniciar: false });

    const estado = this.estadoReiniciar
      ? mensajeActivadoReiniar
      : mensajeDesactivarReiniar;
    this._mqttService.toggle(this.publicar, estado);
  }
}
