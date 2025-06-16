import {  Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FileDialogComponent } from './dialog/file-dialog/file-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DatosService } from '../../../services/Datos/datos.service';
import { HorarioService } from '../../../services/Api/Horario/horario.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, map, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { PreguntaDialogComponent } from '../../elements/pregunta-dialog/pregunta-dialog.component';
import { EditarHorarioComponent } from './crud/editar-horario/editar-horario.component';
import { ElegirFechaComponent } from './crud/elegir-fecha/elegir-fecha.component';

@Component({
  selector: 'app-horario',
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
  templateUrl: './horario.component.html',
  styleUrl: './horario.component.css',
  providers: [DatePipe],
})
export class HorarioComponent implements OnInit {
  pageSize = 20;
  ELEMENT_DATA: any[] = [];
  dataSource: any;
  loading: boolean = true;
  noData = true;

  constructor(
    private dialog: MatDialog,
    private _datos: DatosService,
    private _horario: HorarioService,
    private _toastr: ToastrService,
    public _datePipe: DatePipe,
    public _dialog: MatDialog
  ) {}

  displayedColumns: string[] = [
    'asignatura',
    'profesor',
    'codigoDeLab',
    'dia',
    'horaInicio',
    'horaFinal',
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

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FileDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      const horaDialogRef = this.dialog.open(ElegirFechaComponent, {
        data: {
          titulo: 'Diga la fecha de inicio y fin',
        },
      });

      horaDialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this._datos.jsonData$.subscribe((datos) => {
            var fecha: any;
            this._datos.fechaData$.subscribe((info) => {
              fecha = info;
            });

            if (datos) {
              datos.forEach((data) => {
                this.obtenerIdLab(data.AULA).subscribe({
                  next: (id) => {
                    const todaData = {
                      asignatura: data.ASIGNATURA,
                      profesor: data.PROFESOR,
                      idLaboratorio: id,
                      horaInicio: this.formatearAISOLocal(
                        fecha.fechaInicio,
                        this._datos.excelTiempoAString(data['HORA INICIO'])
                      ),
                      horaFinal: this.formatearAISOLocal(
                        fecha.fechaFinal,
                        this._datos.excelTiempoAString(data['HORA FINAL'])
                      ),
                      dia: data.DIA,
                    };
                    this._horario
                      .postHorario(this.endpoint, todaData)
                      .subscribe({
                        next: (h) => {
                          this.loading = true;
                        },
                        error: (err) => {
                          this._toastr.error(err.error, 'Hubo un error');
                        },complete: () => {
                          this.cargarTabla();
                          this.loading = false;
                        }
                      });
                  },
                });
              });
            };
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
        horaInicio: this.desformatearFecha(element.horaInicio),
        horaFinal: this.desformatearFecha(element.horaFinal),
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
        this._horario
          .deleteHorarioAuto(this.endpointElimnarAuto, 'true')
          .subscribe({
            error: (err) => {
              this.cargarTabla();
              this._toastr.error(err.error.text, 'Hubo un error');
            },
          });
      } else {
        this._toastr.info('No se eliminaron los elementos', 'Información');
      }
    });
  }

  formatearFecha(fechaOriginal: string): string | null {
    return this._datePipe.transform(fechaOriginal, 'dd/MM/yyyy hh:mm a');
  }

  desformatearFecha(fechaOriginal: string): string {
    const [fecha, hora, ampm] = fechaOriginal.split(' ');
    const [dia, mes, anio] = fecha.split('/');
    let [horaStr, minutoStr] = hora.split(':');

    let horaNum = parseInt(horaStr, 10);

    // Ajustar hora según AM/PM
    if (ampm.toUpperCase() === 'PM' && horaNum < 12) {
      horaNum += 12;
    } else if (ampm.toUpperCase() === 'AM' && horaNum === 12) {
      horaNum = 0;
    }

    // Asegurar formato de dos dígitos
    const horaFinal = horaNum.toString().padStart(2, '0');
    const minutoFinal = minutoStr.padStart(2, '0');
    const mesFinal = mes.padStart(2, '0');
    const diaFinal = dia.padStart(2, '0');

    return `${anio}-${mesFinal}-${diaFinal}T${horaFinal}:${minutoFinal}`;
  }

  formatearAISOLocal(fechaStr: string, horaStr: string): string {
    const IsoLocal = `${fechaStr}T${horaStr}:00.000`;
    const fecha = new Date(IsoLocal);

    return fecha.toISOString();
  }

  cargarTabla() {
    this._horario.getHorario(this.endpoint).subscribe({
      next: (e) => {
        const datos = e.map((data: any) => {
          return forkJoin({
            lab: this._horario.getLaboratorio(
              this.endpointLab,
              data.idLaboratorio
            ),
          }).pipe(
            map(({ lab }) => ({
              id: data.id,
              asignatura: data.asignatura,
              profesor: data.profesor,
              codigoDeLab: lab.codigoDeLab,
              idLab: lab.id,
              horaInicio: this.formatearFecha(data.horaInicio),
              horaFinal: this.formatearFecha(data.horaFinal),
              dia: data.dia,
            }))
          );
        });

        forkJoin(datos).subscribe({
          next: (e: any) => {
            const ELEMENT_DATA: any = e;
            this.dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
            this.loading = false;
            this.noData = false;
          },
          error: (err) => {
            this._toastr.error(err.error, 'Error al cargar los laboratorios');
            this.loading = false;
            this.noData = true;
          },
        });
      },
      error: (e) => {
        this._toastr.error(e.error, 'Hubo un Error');
        this.loading = false;
      },
    });
  }

  obtenerIdLab(codigo: string): Observable<number> {
    return this._horario.getIdLaboratorio(this.endpointCodigoLab, codigo).pipe(
      map((e) => e.id) // extraemos sólo el id
    );
  }
}
