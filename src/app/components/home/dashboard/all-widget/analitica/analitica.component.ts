import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  OnInit,
  signal,
} from '@angular/core';
import { AnaliticaTodaComponent } from './analitica-toda/analitica-toda.component';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { DatosService } from '../../../../../services/Datos/datos.service';
import {
  faDroplet,
  faLightbulb,
  faTemperature3,
  faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PisosService } from '../../../../../services/Pisos/pisos.service';

@Component({
  selector: 'app-analitica',
  imports: [
    AnaliticaTodaComponent,
    CommonModule,
    MatTabsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    FontAwesomeModule,
  ],
  templateUrl: './analitica.component.html',
  styleUrl: './analitica.component.css',
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnaliticaComponent implements OnInit {
  fontTemp = faTemperature3;
  fontHum = faDroplet;
  fontLuz = faLightbulb;
  fontSonido = faVolumeHigh;

  tabList: string[] = [];

  pisoSeleccionado = 1;

  // seleccionado: string = this.tabList[0];

  constructor(private _piso: PisosService) {}

  ngOnInit(): void {
    this._piso.tabList$.subscribe({
      next: (labs) => {
        this.tabList = labs;
      },
    });

    this._piso.piso$.subscribe((p) => {
      this.pisoSeleccionado = p;
    });
  }

  // tabSeleccionado() {
  //   return this.seleccionado;
  // }

  // seleccionarTab(tab: string) {
  //   this.seleccionado = tab;
  //   // this._datos.actualizarLabAnalitica(tab);
  // }

  agregarBoton() {
    const nombre = prompt('Escribe el nombre del nuevo laboratorio');
    if (!nombre) return;

    this._piso.agregarLaboratorio(nombre, this.pisoSeleccionado);
  }
}
