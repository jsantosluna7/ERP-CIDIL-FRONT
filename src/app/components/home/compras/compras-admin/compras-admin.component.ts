import { Component } from '@angular/core';
import { ComprasFileDialogComponent } from '../compras-file-dialog/compras-file-dialog.component';
import {
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  map,
  switchMap,
  take,
} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ComprasService } from '../../../../services/Api/compras.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  faAngleDown,
  faAngleRight,
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
import { ActualizarEstatusComponent } from './actualizar-estatus/actualizar-estatus.component';
import { ActualizarEstatusCompraComponent } from './actualizar-estatus-compra/actualizar-estatus-compra.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-compras-admin',
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
  templateUrl: './compras-admin.component.html',
  styleUrl: './compras-admin.component.css',
})
export class ComprasAdminComponent {
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

  cantidadOrdenes: number = 0;
  filtroSeleccionado = new FormControl('id');
  termino = new FormControl('');
  expanded = false;

  filtros = [
    { label: 'ID', value: 'id' },
    { label: 'Nombre', value: 'nombre' },
  ];

  ordenes: any[] = [];

  urlCantidadOrdenes: string = `${process.env['API_URL']}${process.env['ENDPOINT_CANTIDAD_ORDENES']}`;
  urlOrdenes: string = `${process.env['API_URL']}${process.env['ENDPOINT_ORDENES']}`;
  urlEstadosTimeline: string = `${process.env['API_URL']}${process.env['ENDPOINT_ESTADOS_TIMELINE']}`;

  constructor(
    private dialog: MatDialog,
    private _compras: ComprasService,
    private _toastr: ToastrService
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

    this._compras.cantidadOrdenes(this.urlCantidadOrdenes).subscribe({
      next: (cantidad) => {
        this.cantidadOrdenes = cantidad;
      },
      error: (err) => {
        console.error('Error al obtener la cantidad de órdenes:', err);
      },
    });

    this._compras
      .obtenerOrdenes(this.urlOrdenes)
      .pipe(
        switchMap((ordenes: any[]) =>
          forkJoin(
            ordenes.map((orden) =>
              this._compras
                .obtenerEstadosTimelinePorId(
                  this.urlEstadosTimeline,
                  orden.estadoTimelineId
                )
                .pipe(
                  map((timeline) => ({
                    ...orden,
                    timeline,
                  }))
                )
            )
          )
        )
      )
      .subscribe({
        next: (resultado) => {
          console.log(resultado);
        },
        error: (err) => {
          this._toastr.error('No se pudieron cargar las órdenes.', 'Error');
          console.error('Error al obtener las órdenes:', err);
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

  busquedaEnBackend(nombre: string): void {
    // this.loading = true;
    // this.usuarioService
    //   .buscarUsuarios(
    //     this.endpointBusqueda,
    //     nombre,
    //     this.filtroSeleccionado.value ?? 'nombre'
    //   )
    //   .subscribe({
    //     next: (resultados: any) => {
    //       const ELEMENT_DATA = resultados.map((data: any) => ({
    //         id: data.id,
    //         nombreUsuario: data.nombreUsuario,
    //         apellidoUsuario: data.apellidoUsuario,
    //         idMatricula: data.idMatricula,
    //         telefono: data.telefono,
    //         correoInstitucional: data.correoInstitucional,
    //         direccion: data.direccion,
    //         idRol: data.idRol,
    //       }));
    //       this.dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
    //       this.loading = false;
    //       this.secondLoading = false;
    //       this.noData = ELEMENT_DATA.length === 0;
    //     },
    //     error: (err) => {
    //       this.loading = false;
    //       this._toastr.error(err.error.error || '', 'Error en la búsqueda');
    //       console.error('Error en búsqueda:', err.error.error);
    //     },
    //   });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ComprasFileDialogComponent);

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {});
  }

  toggle() {
    this.expanded = !this.expanded;
  }

  actualizarItem(id: number) {
    const dialogRef = this.dialog.open(ActualizarEstatusComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('El dialogo se cerró');
    });
  }

  editarOrden(event: MouseEvent, id: number) {
    event.stopPropagation();
    // Lógica para editar la orden

    const dialogRef = this.dialog.open(ActualizarEstatusCompraComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('El dialogo se cerró');
    });
  }
}
