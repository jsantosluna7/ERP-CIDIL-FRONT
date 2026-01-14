import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faAngleDown,
  faAngleRight,
  faArrowRight,
  faBox,
  faBoxesPacking,
  faBoxOpen,
  faBuilding,
  faCalendar,
  faCartShopping,
  faCircleCheck,
  faCircleXmark,
  faClipboard,
  faClipboardCheck,
  faFile,
  faMagnifyingGlass,
  faMessage,
  faTruck,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { ComprasService } from '../../../../services/Api/compras.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import {
  InformacionTimelineComponent,
  OrdenesInfo,
} from './informacion-timeline/informacion-timeline.component';
import { CantidadOrdenesCacheService } from '../../../../core/CantidadOrdenesCache/cantidad-ordenes-cache.service';

@Component({
  selector: 'app-compras-readonly',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIcon,
    FontAwesomeModule,
    MatFormFieldModule,
    MatChipsModule,
    MatInputModule,
    MatExpansionModule,
    MatButtonModule,
  ],
  templateUrl: './compras-readonly.component.html',
  styleUrl: './compras-readonly.component.css',
})
export class ComprasReadonlyComponent {
  file = faFile;
  lupa = faMagnifyingGlass;
  clipCheck = faClipboardCheck;
  cartShopping = faCartShopping;
  camion = faTruck;
  boxOpen = faBoxOpen;
  boxPacking = faBoxesPacking;
  circleCheck = faCircleCheck;
  circleXmark = faCircleXmark;

  calendar = faCalendar;
  upload = faUpload;
  box = faBox;
  dep = faBuilding;
  mensaje = faMessage;
  angelRight = faAngleRight;
  angelDown = faAngleDown;
  clip = faClipboard;

  arrowRight = faArrowRight;

  cantidadOrdenes: number = 0;
  filtroSeleccionado = new FormControl('id');
  termino = new FormControl('');

  filtros = [
    { label: 'ID', value: 'id' },
    { label: 'Nombre', value: 'nombre' },
  ];

  urlCantidadOrdenes: string = `${process.env['API_URL']}${process.env['ENDPOINT_CANTIDAD_ORDENES']}`;

  constructor(
    private dialog: MatDialog,
    private _compras: ComprasService,
    private _toastr: ToastrService,
    private _cantidadOrdenes: CantidadOrdenesCacheService
  ) {}

  ngOnInit(): void {
    //Busqueda en vivo con el backend
    this.termino.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((valor: any) => {
        if (valor && valor.trim() !== '') {
          // this.busquedaEnBackend(valor.trim());
        } else {
          // this.cargarTabla();
        }
      });

    this._cantidadOrdenes.obtenerCantidad(this.urlCantidadOrdenes).subscribe({
      next: (cantidad) => {
        this.cantidadOrdenes = cantidad;
      },
      error: (err) => {
        this._toastr.error('Error al obtener la cantidad de órdenes:', err);
      },
    });
  }

  cambiarFiltro(filtro: string): void {
    this.filtroSeleccionado.setValue(filtro);
    if (this.termino.value?.trim()) {
      // Refrescar búsqueda con el nuevo filtro activo
      // this.busquedaEnBackend(this.termino.value.trim());
    }
  }

  // ordenes(ordenes: OrdenesInfo, id = 1) {
  //   const dialogRef = this.dialog.open(InformacionTimelineComponent, {
  //     data: { id: id },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log('El dialogo se cerró');
  //   });
  // }

  ordenes(id: number) {
    const dialogRef = this.dialog.open(InformacionTimelineComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('El dialogo se cerró');
    });
  }
}
