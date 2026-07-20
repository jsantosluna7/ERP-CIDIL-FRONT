import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Usuarios } from '../../../../interfaces/usuarios.interface';
import { UsuarioService } from './usuarios.service';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrService } from 'ngx-toastr';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UsuarioDialogComponent } from './usuario-dialog/usuario-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { PreguntaDialogComponent } from '../../../elements/pregunta-dialog/pregunta-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  map,
  switchMap,
  take,
} from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UtilitiesService } from '../../../../services/Utilities/utilities.service';
import { MatChipsModule } from '@angular/material/chips';
import { FormControl, NgModel, ReactiveFormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  imports: [
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    ReactiveFormsModule,
    TitleCasePipe,
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent implements OnInit {
  pageSize = 20;
  ELEMENT_DATA: any[] = [];
  dataSource: any;
  loading: boolean = true;
  noData = true;
  totalUsuarios = 0;
  pageIndex = 0;
  secondLoading: boolean = false;
  filtroSeleccionado = new FormControl('nombre');
  termino = new FormControl('');

  displayedColumns: string[] = [
    'id',
    'nombre',
    'apellido',
    'matricula',
    'telefono',
    'email',
    'direccion',
    'rol',
    'acciones',
  ];

  filtros = [
    { label: 'Nombre', value: 'nombre' },
    { label: 'Apellido', value: 'apellido' },
    { label: 'Matrícula', value: 'matricula' },
    { label: 'Email', value: 'email' },
    { label: 'Rol', value: 'rol' },
  ];

  constructor(
    private usuarioService: UsuarioService,
    private _toastr: ToastrService,
    private _dialog: MatDialog,
    private _utilities: UtilitiesService
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

  endpoint: string = `${process.env['API_URL']}${process.env['ENDPOINT_USUARIOS']}`;
  endpointBusqueda: string = `${process.env['API_URL']}${process.env['ENDPOINT_USUARIOS_BUSQUEDA']}`;

  ngOnInit(): void {
    this.loading = true;
    this.cargarTabla();

    //Busqueda en vivo con el backend
    this.termino.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((valor: any) => {
        if (valor && valor.trim() !== '') {
          this.busquedaEnBackend(valor.trim());
        } else {
          this.cargarTabla();
        }
      });
  }

  cambiarFiltro(filtro: string): void {
    this.filtroSeleccionado.setValue(filtro);
    if (this.termino.value?.trim()) {
      // Refrescar búsqueda con el nuevo filtro activo
      this.busquedaEnBackend(this.termino.value.trim());
    }
  }

  busquedaEnBackend(nombre: string): void {
    this.loading = true;

    this.usuarioService
      .buscarUsuarios(
        this.endpointBusqueda,
        nombre,
        this.filtroSeleccionado.value ?? 'nombre'
      )
      .subscribe({
        next: (resultados: any) => {
          const ELEMENT_DATA = resultados.map((data: any) => ({
            id: data.id,
            nombreUsuario: data.nombreUsuario,
            apellidoUsuario: data.apellidoUsuario,
            idMatricula: data.idMatricula,
            telefono: data.telefono,
            correoInstitucional: data.correoInstitucional,
            direccion: data.direccion,
            idRol: data.idRol,
          }));
          this.dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
          this.loading = false;
          this.secondLoading = false;
          this.noData = ELEMENT_DATA.length === 0;
        },
        error: (err) => {
          this.loading = false;
          this._toastr.error(err.error.error || '', 'Error en la búsqueda');
          console.error('Error en búsqueda:', err.error.error);
        },
      });
    // this.inventarioService.buscarInventario(nombre).subscribe({
    //   next: (resultados: any) => {
    //     //mapeamos los datos con la info del lab
    //     let datosFiltrados = resultados.filter((data: any) => data.disponible);

    //     this.cartasConLaboratorio = datosFiltrados.map((data: any) => {
    //       return {
    //         id: data.id,
    //         nombreData: data.nombre,
    //         cantidad: data.cantidad,
    //         disponible: data.disponible,
    //         imagen: data.imagenEquipo,
    //       };
    //     });

    //     this.loading = false;
    //   },
    //   error: (err: any) => {
    //     this.loading = false;
    //     this._toastr.error(err.error.error || '', 'Error en la búsqueda');
    //     console.error('Error en búsqueda:', err.error.error);
    //   },
    // });
  }

  cargarTabla() {
    this.loading = true;

    this.usuarioService
      .getUsuarios(this.endpoint, this.pageIndex + 1, this.pageSize)
      .subscribe({
        next: (response: any) => {
          this.totalUsuarios = response.paginacion.totalUsuarios;

          const ELEMENT_DATA = response.datos.map((data: any) => ({
            id: data.id,
            nombreUsuario: data.nombreUsuario,
            apellidoUsuario: data.apellidoUsuario,
            idMatricula: data.idMatricula,
            telefono: data.telefono,
            correoInstitucional: data.correoInstitucional,
            direccion: data.direccion,
            idRol: data.idRol,
          }));

          this.dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
          this.loading = false;
          this.secondLoading = false;
          this.noData = ELEMENT_DATA.length === 0;
        },
        error: (err) => {
          this._toastr.error(err.error, 'Error al cargar los usuarios');
          this.loading = false;
          this.secondLoading = false;
          this.noData = true;
        },
      });
  }

  eliminar(id: string) {
    const dialogRef = this._dialog.open(PreguntaDialogComponent, {
      data: {
        titulo: '¿Seguro?',
        mensaje: '¿Quieres eliminar el usuario de forma PERMANENTE?',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result) {
          this.usuarioService.eliminarUsuario(id).subscribe({
            next: () => {
              this._toastr.success('Usuario eliminado correctamente');
              this.ngOnInit();
            },
            error: (err) => {
              console.error('Error al eliminar usuario:', err);
            },
          });
        } else {
          this._toastr.info('No se pudo eliminar el usuario.');
        }
      });
  }

  cambiarRol(usuario: Usuarios) {
    const nuevoRol = prompt(
      'Ingrese el nuevo rol (Estudiante, Administrador, Super Usuario):',
      usuario.idrol
    );
    const rolesValidos: Usuarios['idrol'][] = [
      'Estudiante',
      'Administrador',
      'Super Usuario',
    ];

    if (nuevoRol && rolesValidos.includes(nuevoRol as Usuarios['idrol'])) {
      this.usuarioService
        .cambiarRol(Number(usuario.sub), nuevoRol as Usuarios['idrol'])
        .subscribe({
          next: () => {
            this._toastr.success('Rol actualizado correctamente.');
            this.ngOnInit();
          },
          error: () => {
            this._toastr.error('Error al actualizar el rol.');
          },
        });
    } else if (nuevoRol) {
      this._toastr.warning('Rol inválido.');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onPageChange(event: PageEvent) {
    this.secondLoading = true;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.cargarTabla();
  }

  updatePageSize(event: Event) {
    const input = event.target as HTMLInputElement;
    const newSize = parseInt(input.value, 10);
    if (newSize > 0) {
      this.pageSize = newSize;
      this.paginator.pageSize = newSize;
      this.paginator.firstPage();
    }
  }

  desactivarUsuario(usuario: Usuarios): void {
    const dialogRef = this._dialog.open(PreguntaDialogComponent, {
      data: {
        titulo: '¿Seguro?',
        mensaje: '¿Quieres desactivar el usuario?',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result) {
          const nuevoEstado = !usuario.activado;
          this.usuarioService
            .desactivarUsuario(Number(usuario.sub), nuevoEstado)
            .subscribe({
              next: () => {
                usuario.activado = nuevoEstado;
                this._toastr.success(
                  `Usuario ${
                    nuevoEstado ? 'activado' : 'dasactivado'
                  } correctamente.`
                );
              },
              error: (err) => {
                console.error(err);
                this._toastr.info('Se  desactivo  el usuario');
              },
            });
        } else {
          this._toastr.info('No se  cambio el estado del usuario');
        }
      });
  }

  //otra vista

  readonly dialog = inject(MatDialog);

  openDialog(usuario: Usuarios) {
    const dialogRef = this.dialog.open(UsuarioDialogComponent, {
      width: '400px',
      data: usuario,
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result) {
          this.usuarioService.obtenerUsuariosPag().subscribe((data) => {
            this.dataSource.data = data.datos;
            this.dataSource.paginator = this.paginator!;
            this.dataSource.sort = this.sort!;
            this._toastr.success('Tabla actualizada tras edición');
          });
        }
      });
  }
}
