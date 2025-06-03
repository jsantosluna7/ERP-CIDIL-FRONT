import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DatosService } from '../../../services/Datos/datos.service';

const ELEMENT_DATA: any[] = [
  { nombre: 'Juan', apellido: 'Pérez', horario: '08:00 - 16:00' },
  { nombre: 'María', apellido: 'Gómez', horario: '09:00 - 17:00' },
  { nombre: 'Alondra', apellido: 'Gómez', horario: '09:00 - 17:00' },
  // Agrega más datos según sea necesario
];

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
  ],
  templateUrl: './horario.component.html',
  styleUrl: './horario.component.css',
})
export class HorarioComponent implements OnInit {
  pageSize = 20;
  datosRecibidos: any[] = [];

  constructor(private dialog: MatDialog, private _datos: DatosService) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(FileDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('El diálogo fue cerrado');
    });
  }

  displayedColumns: string[] = ['nombre', 'apellido', 'horario', 'acciones'];
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    console.log(process.env['EJEMPLO']); //Utilización de .env

    this._datos.jsonData$.subscribe((datos) => {
      if(datos){
        this.datosRecibidos = datos
        console.log(this.datosRecibidos)
      }
    })

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editar(element: any) {
    // Lógica para editar el elemento
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
}
