import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FileDialogComponent } from './dialog/file-dialog/file-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DatosService } from '../../../services/Datos/datos.service';
import { ContentObserver } from '@angular/cdk/observers';
import { HorarioService } from '../../../services/Api/Horario/horario.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, map } from 'rxjs';
import { DatePipe } from '@angular/common';
import { PreguntaDialogComponent } from '../../elements/pregunta-dialog/pregunta-dialog.component';
import { EditarHorarioComponent } from './crud/editar-horario/editar-horario.component';

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

  endpoint: string = `${process.env['API_URL']}${process.env['ENDPOINT_HORARIO']}`;
  endpointLab: string = `${process.env['API_URL']}${process.env['ENDPOINT_LABORATORIO_ID']}`;
  endpointElimnarAuto: string = `${process.env['API_URL']}${process.env['ENDPOINT_HORARIO_AUTO']}`;

  ngOnInit() {
    this._horario.getHorario(this.endpoint).subscribe({
      next: (e) => {
        // console.log(e);

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
              horaInicio: this.formatearFecha(data.horaInicio),
              horaFinal: this.formatearFecha(data.horaFinal),
              dia: data.dia,
            }))
          );
        });

        forkJoin(datos).subscribe({
          next: (e) => {
            const ELEMENT_DATA: any = e;
            this.dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
            this.loading = false;
          },
          error: (err) => {
            this._toastr.error(err.error, 'Error al cargar los laboratorios');
            this.loading = false;
          },
        });
      },
      error: (e) => {
        this._toastr.error(e.error, 'Hubo un Error');
        this.loading = false;
      },
    });

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FileDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      this._datos.jsonData$.subscribe((datos) => {
        if (datos) {
          datos.forEach((data) => {
            const todaData = {
              asignatura: 'Circuito',
              profesor: 'Alayn',
              idLaboratorio: 1,
              horaInicio: '2025-06-10T00:24:46.675Z',
              horaFinal: '2025-06-15T00:24:46.675Z',
              dia: 'Lunes',
            };
            console.log(data);
            this._horario.postHorario(this.endpoint, todaData).subscribe();
          });
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
        dia: element.dia,
        horaInicio: this.desformatearFecha(element.horaInicio),
        horaFinal: this.desformatearFecha(element.horaFinal),
      },
    });

    dialogRef.afterClosed().subscribe((e) => {
      if (!e) {
        this._toastr.info('Se canceló la operación', 'Información');
      }
    })

    console.log('Editar', element);
  }

  eliminar(element: any) {
    const index = this.dataSource.data.indexOf(element);
    if (index >= 0) {
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription(); // Actualiza la tabla
    }
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
      console.log(result);
      if (result) {
        this._horario
          .deleteHorarioAuto(this.endpointElimnarAuto, 'true')
          .subscribe({
            error: (err) => {
              this._toastr.error(err.error, 'Hubo un error');
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
}
