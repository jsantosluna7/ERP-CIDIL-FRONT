import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatosService } from '../../../../services/Datos/datos.service';
import { ToastrService } from 'ngx-toastr';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { forkJoin, map, switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PreguntaDialogComponent } from '../../../elements/pregunta-dialog/pregunta-dialog.component';
import { MqttIOTService } from '../../../../services/Api/Mqtt/mqtt-iot.service';
import { LaboratorioService } from '../../../../services/Api/Laboratorio/laboratorio.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FechaDialogComponent } from '../../../elements/fecha-dialog/fecha-dialog.component';
import { UtilitiesService } from '../../../../services/Utilities/utilities.service';

@Component({
  selector: 'app-mqtt-table',
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
  templateUrl: './mqtt-table.component.html',
  styleUrl: './mqtt-table.component.css',
  providers: [DatePipe],
})
export class MqttTableComponent {
  pageSize = 20;
  pageIndex = 0;
  totalIoT = 0;
  ELEMENT_DATA: any[] = [];
  dataSource: any;
  loading: boolean = true;
  secondLoading: boolean = false;
  noData = true;

  constructor(
    private dialog: MatDialog,
    private _mqtt: MqttIOTService,
    private _lab: LaboratorioService,
    private _toastr: ToastrService,
    public _dialog: MatDialog,
    public _datePipe: DatePipe,
    private _datos: DatosService,
    private _utilities: UtilitiesService
  ) {}

  displayedColumns: string[] = [
    'idPlaca',
    'codigoDeLab',
    'sensor1',
    'sensor2',
    'sensor3',
    'sensor4',
    'sensor5',
    'actuador',
    'horaEntrada',
    'acciones',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

  endpoint: string = `${process.env['API_URL']}${process.env['ENDPOINT_IOT']}`;
  endpointFiltrado: string = `${process.env['API_URL']}${process.env['ENDPOINT_IOT_FILTRO']}`;
  endpointLab: string = `${process.env['API_URL']}${process.env['ENDPOINT_LABORATORIO']}`;

  ngOnInit() {
    this.cargarTabla();
    // this.cargarPagina();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  exportar(tipo: 'xlsx' | 'xls' | 'csv') {
    const dialogRef = this._dialog.open(FechaDialogComponent, {
      data: {
        titulo: 'Introduce la fecha',
        ifLab: true,
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (n) => {
        if (n) {
          this._datos.fechaData$.subscribe({
            next: (f: any) => {
              this._mqtt
                .filtradoIot(
                  this.endpointFiltrado,
                  f.fechaInicio,
                  f.fechaFinal,
                  f.labId
                )
                .subscribe({
                  next: (ex) => {
                    const totalInfo = ex.map((e: any) => {
                      return {
                        id: e.id,
                        idPlaca: e.idPlaca,
                        idLaboratorio: e.idLaboratorio,
                        sensor1: e.sensor1,
                        sensor2: e.sensor2,
                        sensor3: e.sensor3,
                        sensor4: e.sensor4,
                        sensor5: e.sensor5,
                        actuador: e.actuador,
                        horaEntrada: this._utilities.formatearFecha(
                          e.horaEntrada
                        ),
                      };
                    });

                    const worksheet = XLSX.utils.json_to_sheet(totalInfo);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(
                      workbook,
                      worksheet,
                      'Mediciones'
                    );
                    const excelBuffer = XLSX.write(workbook, {
                      bookType: 'csv',
                      type: 'array',
                    });
                    const blob = new Blob([excelBuffer], {
                      type:
                        tipo === 'csv'
                          ? 'text/csv;charset=utf-8'
                          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    });
                    saveAs(
                      blob,
                      `Mediciones-${f.lab}-${this._utilities.formatearFecha(
                        f.fechaInicio
                      )}-${this._utilities.formatearFecha(
                        f.fechaFinal
                      )}.${tipo}`
                    );
                  },
                  error: (err) => {
                    this._toastr.error(err.error, 'Hubo un error al filtrar');
                  },
                });
            },
            error: (err) => {
              this._toastr.error(err.error, 'Hubo un error');
            },
          });
        } else {
          this._toastr.info('Se canceló la operación');
        }
      },
      error: (err) => {
        this._toastr.error(err.error, 'Hubo un error con el dialogo');
      },
    });
  }

  exportarExcel() {
    const dialogRef = this._dialog.open(FechaDialogComponent, {
      data: {
        titulo: 'Introduce la fecha',
        ifLab: true,
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (n) => {
        if (n) {
          this._datos.fechaData$.subscribe({
            next: (f: any) => {
              console.log(f);
              this._mqtt
                .filtradoIot(
                  this.endpointFiltrado,
                  f.fechaInicio,
                  f.fechaFinal,
                  f.labId
                )
                .subscribe({
                  next: (ex) => {
                    const totalInfo = ex.map((e: any) => {
                      return {
                        id: e.id,
                        idPlaca: e.idPlaca,
                        idLaboratorio: e.idLaboratorio,
                        sensor1: e.sensor1,
                        sensor2: e.sensor2,
                        sensor3: e.sensor3,
                        sensor4: e.sensor4,
                        sensor5: e.sensor5,
                        actuador: e.actuador,
                        horaEntrada: this._utilities.formatearFecha(
                          e.horaEntrada
                        ),
                      };
                    });

                    const worksheet = XLSX.utils.json_to_sheet(totalInfo);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(
                      workbook,
                      worksheet,
                      'Mediciones'
                    );
                    const excelBuffer = XLSX.write(workbook, {
                      bookType: 'xlsx',
                      type: 'array',
                    });
                    const blob = new Blob([excelBuffer], {
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    });
                    saveAs(
                      blob,
                      `Mediciones-${f.lab}-${this._utilities.formatearFecha(
                        f.fechaInicio
                      )}-${this._utilities.formatearFecha(f.fechaFinal)}.xlsx`
                    );
                  },
                  error: (err) => {
                    this._toastr.error(err.error, 'Hubo un error al filtrar');
                  },
                });
            },
            error: (err) => {
              this._toastr.error(err.error, 'Hubo un error');
            },
          });
        } else {
          this._toastr.info('Se canceló la operación');
        }
      },
      error: (err) => {
        this._toastr.error(err.error, 'Hubo un error con el dialogo');
      },
    });
  }

  onPageChange(event: PageEvent) {
    this.secondLoading = true;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.cargarTabla();
  }

  // private cargarPagina() {
  //   this._mqtt
  //     .paginationIot(this.endpoint, this.pageIndex + 1, this.pageSize)
  //     .subscribe({
  //       next: (resp: any) => {
  //         console.log(resp);
  //         this.dataSource.data = resp.datos;
  //         this.totalIoT = resp.paginacion.totalLoT
  //       }, error: (err) => {
  //         console.log(err);
  //         this._toastr.error(err.error, 'Hubo un error');
  //       }
  //     });
  // }

  // cargarTabla() {
  //   this._mqtt.getIot(this.endpoint, this.pageIndex + 1, this.pageSize).subscribe({
  //     next: (e: any) => {
  //       const all = e.datos;
  //       this.totalIoT = e.paginacion.totalLoT;
  //       const datos = all.map((data: any) => {
  //         return forkJoin({
  //           lab: this._lab.getLabById(this.endpointLab, data.idLaboratorio),
  //         }).pipe(
  //           map(({ lab }) => ({
  //             id: data.id,
  //             idPlaca: data.idPlaca,
  //             codigoDeLab: lab.codigoDeLab,
  //             sensor1: data.sensor1,
  //             sensor2: data.sensor2,
  //             sensor3: data.sensor3,
  //             sensor4: data.sensor4,
  //             sensor5: data.sensor5,
  //             actuador: data.actuador,
  //             horaEntrada: this.formatearFecha(data.horaEntrada),
  //           }))
  //         );
  //       });

  //       forkJoin(datos).subscribe({
  //         next: (e: any) => {
  //           const ELEMENT_DATA: any = e;
  //           this.dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  //           this.loading = false;
  //           this.noData = false;
  //         },
  //         error: (err) => {
  //           this._toastr.error(err.error, 'Error al cargar los laboratorios');
  //           this.loading = false;
  //           this.noData = true;
  //         },
  //       });
  //     },
  //     error: (e) => {
  //       this._toastr.error(e.error, 'Hubo un Error');
  //       this.loading = false;
  //     },
  //   });
  // }

  cargarTabla() {
    // this.loading = true;
    this._mqtt
      .getIot(this.endpoint, this.pageIndex + 1, this.pageSize)
      .pipe(
        switchMap((e: any) => {
          this.totalIoT = e.paginacion.totalLoT;
          const items$ = e.datos.map((data: any) =>
            forkJoin({
              lab: this._lab.getLabById(this.endpointLab, data.idLaboratorio),
            }).pipe(
              map(({ lab }) => ({
                id: data.id,
                idPlaca: data.idPlaca,
                codigoDeLab: lab.codigoDeLab,
                sensor1: data.sensor1,
                sensor2: data.sensor2,
                sensor3: data.sensor3,
                sensor4: data.sensor4,
                sensor5: data.sensor5,
                actuador: data.actuador,
                horaEntrada: this.formatearFecha(data.horaEntrada),
              }))
            )
          );
          return forkJoin(items$);
        })
      )
      .subscribe({
        next: (items: any) => {
          const ELEMENT_DATA: any = items;
          this.dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
          this.loading = false;
          this.secondLoading = false;
          this.noData = false;
        },
        error: (err) => {
          this._toastr.error(err.error || err, 'Error cargando datos');
          this.loading = false;
          this.secondLoading = false;
          this.noData = true;
        },
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  eliminar(element: any) {
    const dialogRef = this.dialog.open(PreguntaDialogComponent, {
      data: {
        titulo: '¿Seguro que quieres eliminar este IoT?',
        mensaje:
          'Se eliminará definitivamente el IoT que acabas de seleccionar',
      },
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (!response) {
        this._toastr.info('Se canceló la operación', 'Información');
      } else {
        this._mqtt.deleteIot(this.endpoint, element.id).subscribe({
          next: (h) => {
            this.cargarTabla();
          },
          error: (err) => {
            console.log(err);
            this._toastr.info(err.error.text, 'Información');
          },
        });
      }
    });
  }

  formatearFecha(fechaOriginal: string): string | null {
    return this._datePipe.transform(fechaOriginal, 'dd/MM/yyyy hh:mm a');
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
}
