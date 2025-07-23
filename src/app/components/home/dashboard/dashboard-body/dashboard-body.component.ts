import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { DashboardService } from '../../../../services/Dashboard/dashboard.service';
import { AnaliticaComponent } from '../all-widget/analitica/analitica.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendarCheck,
  faMicrochip,
  faPeopleGroup,
} from '@fortawesome/free-solid-svg-icons';
import { CalendarioComponent } from '../all-widget/calendario/calendario.component';

@Component({
  selector: 'app-dashboard-body',
  imports: [
    MatMenuModule,
    FontAwesomeModule,
    AnaliticaComponent,
    CalendarioComponent,
  ],
  templateUrl: './dashboard-body.component.html',
  styleUrl: './dashboard-body.component.css',
  providers: [DashboardService],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardBodyComponent implements OnInit {
  faCalendar = faCalendarCheck;
  faGroup = faPeopleGroup;
  faElectronics = faMicrochip;

  cantidadPrestamosEquipos: number = 0;
  cantidadReservaEspacios: number = 0;
  cantidadUsuarios: number = 0;

  endpointPrestamosEquipos: string = `${process.env['API_URL']}${process.env['ENDPOINT_CANTIDAD_PRESTAMOS_EQUIPOS']}`;
  endpointReservaEspacios: string = `${process.env['API_URL']}${process.env['ENDPOINT_CANTIDAD_RESERVA_ESPACIO']}`;
  endpointUsuarios: string = `${process.env['API_URL']}${process.env['ENDPOINT_CANTIDAD_USUARIOS']}`;

  constructor(private _dashboardService: DashboardService) {}

  ngOnInit(): void {
    this._dashboardService
      .getCantidadPrestamosEquipos(this.endpointPrestamosEquipos)
      .subscribe({
        next: (data) => {
          this.cantidadPrestamosEquipos = data.totalPrestamosEquipos;
        },
      });

    this._dashboardService
      .getCantidadReservaEspacios(this.endpointReservaEspacios)
      .subscribe({
        next: (data) => {
          this.cantidadReservaEspacios = data.totalReservaEspacios;
        },
      });

    this._dashboardService
      .getCantidadUsuarios(this.endpointUsuarios)
      .subscribe({
        next: (data) => {
          this.cantidadUsuarios = data.totalUsuarios;
        },
      });
  }
}
