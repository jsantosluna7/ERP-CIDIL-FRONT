import { Component } from '@angular/core';
import { ComprasFileDialogComponent } from '../compras-file-dialog/compras-file-dialog.component';
import { debounceTime, distinctUntilChanged, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFile } from '@fortawesome/free-regular-svg-icons';
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
  faBoxOpen,
  faBuilding,
  faCalendar,
  faClipboard,
  faMessage,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-compras-admin',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButton,
    MatIcon,
    FontAwesomeModule,
    MatFormFieldModule,
    MatChipsModule,
    MatInputModule,
    MatExpansionModule,
  ],
  templateUrl: './compras-admin.component.html',
  styleUrl: './compras-admin.component.css',
})
export class ComprasAdminComponent {
  file = faFile;
  boxOpen = faBoxOpen;
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
  expanded = true;

  filtros = [
    { label: 'ID', value: 'id' },
    { label: 'Nombre', value: 'nombre' },
  ];

  urlCantidadOrdenes: string = `${process.env['API_URL']}${process.env['ENDPOINT_CANTIDAD_ORDENES']}`;

  constructor(private dialog: MatDialog, private _compras: ComprasService) {}

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

  open(){
    console.log("open");
  }
}
