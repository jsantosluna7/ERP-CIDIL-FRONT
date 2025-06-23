import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { DatosService } from '../../../../../services/Datos/datos.service';
import { HorarioService } from '../../../../../services/Api/Horario/horario.service';
import { LaboratorioService } from '../../../../../services/Api/Laboratorio/laboratorio.service';
import { UtilitiesService } from '../../../../../services/Utilities/utilities.service';
import { FileDialogComponent } from '../../dialog/file-dialog/file-dialog.component';
import { ElegirFechaComponent } from '../../crud/elegir-fecha/elegir-fecha.component';
import { EditarHorarioComponent } from '../../crud/editar-horario/editar-horario.component';
import { PreguntaDialogComponent } from '../../../../elements/pregunta-dialog/pregunta-dialog.component';
import { FechaDialogComponent } from '../../../../elements/fecha-dialog/fecha-dialog.component';

@Component({
  selector: 'app-horario-table',
  imports: [
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './horario-table.component.html',
  styleUrl: './horario-table.component.css',
})
export class HorarioTableComponent {
  pageSize = 20;
  ELEMENT_DATA: any[] = [];
  dataSource: any;
  loading: boolean = true;
  noData = true;
  totalHorario = 0;
  pageIndex = 0;
  secondLoading: boolean = false;

  constructor(
    private dialog: MatDialog,
    private _datos: DatosService,
    private _horario: HorarioService,
    private _lab: LaboratorioService,
    private _toastr: ToastrService,
    public _dialog: MatDialog,
    private _utilities: UtilitiesService
  ) {}

  displayedColumns: string[] = [
    'asignatura',
    'profesor',
    'codigoDeLab',
    'dia',
    'horaInicio',
    'horaFinal',
    'fechaInicio',
    'fechaFinal',
    'acciones',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

  endpoint: string = `${process.env['API_URL']}${process.env['ENDPOINT_HORARIO']}`;
  endpointLab: string = `${process.env['API_URL']}${process.env['ENDPOINT_LABORATORIO']}`;
  endpointElimnarAuto: string = `${process.env['API_URL']}${process.env['ENDPOINT_HORARIO_AUTO']}`;
  endpointCodigoLab: string = `${process.env['API_URL']}${process.env['ENDPOINT_LABORATORIO_CODIGO']}`;

  ngOnInit() {
    this.cargarTabla();
  }

  onPageChange(event: PageEvent) {
    this.secondLoading = true;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.cargarTabla();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FileDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      const horaDialogRef = this.dialog.open(FechaDialogComponent, {
        data: {
          titulo: 'Diga la fecha de inicio y fin',
          ifLab: false
        },
      });

      horaDialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this._datos.jsonData$.subscribe((datos) => {
            
            var fecha: any;
            this._datos.fechaData$.subscribe((info) => {
              fecha = info;
            });

            console.log(fecha);

            if (datos) {
              const observables = datos.map((data) =>
                this.obtenerIdLab(data.AULA).pipe(
                  map((id) => ({
                    asignatura: data.ASIGNATURA,
                    profesor: data.PROFESOR,
                    idLaboratorio: id,
                    horaInicio: this._datos.excelTiempoAString(
                      data['HORA INICIO']
                    ),
                    horaFinal: this._datos.excelTiempoAString(
                      data['HORA FINAL']
                    ),
                    fechaInicio: fecha.fechaInicio,
                    fechaFinal: fecha.fechaFinal,
                    dia: data.DIA,
                  }))
                )
              );

              forkJoin(observables).subscribe({
                next: (todosLosHorarios) => {
                  this._horario
                    .postHorario(this.endpoint, todosLosHorarios)
                    .subscribe({
                      next: (h) => {
                        console.log(h);
                        this.loading = true;
                      },
                      error: (err) => {
                        console.log(err);
                        this._horario.buildHTML(err.error.detalles);

                        this._toastr.error(err.error.mensaje, 'Hubo un error');
                      },
                      complete: () => {
                        this.cargarTabla();
                        this.loading = false;
                      },
                    });
                },
                error: (err) => {
                  console.log(err);
                  this._toastr.error('Error al obtener IDs de laboratorios');
                },
              });
            }
          });
        } else {
          this._toastr.info('Se canceló la operación', 'Información');
        }
      });
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editar(element: any) {
    const dialogRef = this._dialog.open(EditarHorarioComponent, {
      data: {
        id: element.id,
        asignatura: element.asignatura,
        profesor: element.profesor,
        laboratorio: element.codigoDeLab,
        idLabEdit: element.idLab,
        dia: element.dia,
        horaInicio: element.horaInicio,
        horaFinal: element.horaFinal,
        fechaInicio: this._utilities.desformatearHorarioFecha(element.fechaInicio),
        fechaFinal: this._utilities.desformatearHorarioFecha(element.fechaFinal),
      },
    });

    dialogRef.afterClosed().subscribe((e) => {
      if (e) {
        this.cargarTabla();
      } else {
        this._toastr.info('Se canceló la operación', 'Información');
      }
    });
  }

  eliminar(element: any) {
    const dialogRef = this.dialog.open(PreguntaDialogComponent, {
      data: {
        titulo: '¿Seguro que quieres eliminar este horario?',
        mensaje:
          'Se eliminará definitivamente el horario que acabas de seleccionar',
      },
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (!response) {
        this._toastr.info('Se canceló la operación', 'Información');
      } else {
        this._horario.deleteHorario(this.endpoint, element.id).subscribe({
          next: (h) => {
            this.cargarTabla();
          },
          error: (err) => {
            this._toastr.error(err.error, 'Hubo un error');
          },
        });
      }
    });
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

  borradoAuto() {
    const dialogRef = this._dialog.open(PreguntaDialogComponent, {
      data: {
        titulo: '¿Seguro?',
        mensaje:
          '¿Quieres eliminar automaticamente todos los elementos del horario?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._horario.deleteHorarioAuto(this.endpointElimnarAuto).subscribe({
          error: (err) => {
            this.cargarTabla();
            console.log(err);
            this._toastr.error(err.error, 'Hubo un error');
          },
        });
      } else {
        this._toastr.info('No se eliminaron los elementos', 'Información');
      }
    });
  }

  cargarTabla() {
    this._horario
      .getHorario(this.endpoint, this.pageIndex + 1, this.pageSize)
      .pipe(
        switchMap((e: any) => {
          this.totalHorario = e.paginacion.totalHorario;

          const datos$ = e.datos.map((data: any) =>
            forkJoin({
              lab: this._lab.getLabById(this.endpointLab, data.idLaboratorio),
            }).pipe(
              map(({ lab }) => ({
                id: data.id,
                asignatura: data.asignatura,
                profesor: data.profesor,
                codigoDeLab: lab.codigoDeLab,
                idLab: lab.id,
                horaInicio: this._utilities.formatearHora(data.horaInicio),
                horaFinal: this._utilities.formatearHora(data.horaFinal),
                fechaInicio: this._utilities.formatearHorarioFecha(data.fechaInicio),
                fechaFinal: this._utilities.formatearHorarioFecha(data.fechaFinal),
                dia: data.dia,
              }))
            )
          );
          return forkJoin(datos$);
        })
      )
      .subscribe({
        next: (e: any) => {
          const ELEMENT_DATA: any = e;
          this.dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
          this.loading = false;
          this.secondLoading = false;
          this.noData = false;
        },
        error: (err) => {
          this._toastr.error(err.error, 'Error al cargar los laboratorios');
          this.loading = false;
          this.secondLoading = false;
          this.noData = true;
        },
      });
  }

  obtenerIdLab(codigo: string): Observable<number> {
    return this._horario.getIdLaboratorio(this.endpointCodigoLab, codigo).pipe(
      map((e) => e.id) // extraemos sólo el id
    );
  }
}
