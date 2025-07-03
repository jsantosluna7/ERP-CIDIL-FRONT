import { ChangeDetectionStrategy, Component, computed, effect, OnInit, signal } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnaliticaComponent implements OnInit {
  fontTemp = faTemperature3;
  fontHum = faDroplet;
  fontLuz = faLightbulb;
  fontSonido = faVolumeHigh;

  tabList: string[] = [];
  seleccionado: string = this.tabList[0];

  constructor(private _datos: DatosService) {
  }

  ngOnInit(): void {
    this._datos.tabList$.subscribe({
      next: (e) => {
        this.tabList = e;
      },
      error: (err) => {
        console.error(err);
      },
    });

    console.log(this.tabList);
  }

  tabSeleccionado() {
    return this.seleccionado;
  }

  seleccionarTab(tab: string) {
    this.seleccionado = tab;
    // this._datos.actualizarLabAnalitica(tab);
  }


  agregarBoton() {
    const nombre = prompt('Escribe el nombre del nuevo botón');
    if (!nombre) return;

    // switch (this.pisoSeleccionado) {
    //   case 0:
    //     this.listaDeLabs1erPiso.push(nombre);
    //     this.tabList = [...this.listaDeLabs1erPiso];
    //     break;
    //   case 1:
    //     this.listaDeLabs2doPiso.push(nombre);
    //     this.tabList = [...this.listaDeLabs2doPiso];
    //     break;
    //   case 2:
    //     this.listaDeLabs3erPiso.push(nombre);
    //     this.tabList = [...this.listaDeLabs3erPiso];
    //     break;
    //   case 3:
    //     this.listaDeLabsTodo.push(nombre);
    //     this.tabList = [...this.listaDeLabsTodo];
    //     break;
    // }
  }

  eliminarBoton(tab: string) {
    // switch (this.pisoSeleccionado) {
    //   case 0:
    //     this.listaDeLabs1erPiso = this.listaDeLabs1erPiso.filter(
    //       (t) => t !== tab
    //     );
    //     this.tabList = [...this.listaDeLabs1erPiso];
    //     break;
    //   case 1:
    //     this.listaDeLabs2doPiso = this.listaDeLabs2doPiso.filter(
    //       (t) => t !== tab
    //     );
    //     this.tabList = [...this.listaDeLabs2doPiso];
    //     break;
    //   case 2:
    //     this.listaDeLabs3erPiso = this.listaDeLabs3erPiso.filter(
    //       (t) => t !== tab
    //     );
    //     this.tabList = [...this.listaDeLabs3erPiso];
    //     break;
    //   case 3:
    //     this.listaDeLabsTodo = this.listaDeLabsTodo.filter((t) => t !== tab);
    //     this.tabList = [...this.listaDeLabsTodo];
    //     break;
    // }

    // Si el eliminado estaba seleccionado, elige otro
    if (this.seleccionado === tab) {
      this.seleccionado = this.tabList[0];
    }
  }
}
