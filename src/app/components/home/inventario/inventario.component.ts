import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Carta } from '../../../interfaces/carta';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../carrito/carrito.service';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { InventarioService } from '../../../services/Inventario/inventario.service';
import { MatCardModule } from '@angular/material/card';
import { CartaCarrito } from '../carrito/cartaCarrito.interface';
import { LaboratorioService } from '../../../services/Laboratorio/laboratorio.service';
import { Laboratorio } from '../../../interfaces/laboratorio.interface';
import {  forkJoin, map } from 'rxjs';
import { ContentObserver } from '@angular/cdk/observers';
import { subscribe } from 'diagnostics_channel';

@Component({
  selector: 'app-inventario',
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css',
})
export class InventarioComponent implements OnInit, AfterViewInit {
  pageSize = 20;
  totalItems = 0;
  paginaActual = 1;

  cartas: Carta[] = [];
  cartasConLaboratorio: any[] = [];
  cartasFiltradas: Carta[] = [];
  laboratorios: Laboratorio[] = [];

  /* ---------- Paginacion ------------ */

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private inventarioService: InventarioService,
    private carritoService: CarritoService,
    private toastr: ToastrService,
    private laboratorioService: LaboratorioService
  ) {}

  dataSource = new MatTableDataSource<any>([]);

  ngOnInit(): void {
    
    this.cargarCartas();
    this.laboratorioService.getLaboratorios().subscribe((n: any) =>{
       console.log(n)
    })
    
  }

  cargarCartas() {
    this.inventarioService
      .getCartas(this.paginaActual, this.pageSize)
      .subscribe({
        next: (d: any) => {
          const all = d.datos
          const datos = all.map((data: any) => forkJoin({
            lab: this.laboratorioService.getLaboratorioPorId(data.idLaboratorio),
          }).pipe(
            map(({ lab }) => ({
              id: data.id,
              nombre: lab.codigoDeLab,
              nombreData: data.nombre,
              cantidad: data.cantidad,
              disponible: data.disponible,
              imagen:data.imagenEquipo,
            }))
          ));

          forkJoin(datos).subscribe({
            next: (i: any) => {
              this.cartasConLaboratorio = i;
              console.log(i);


               this.dataSource = new MatTableDataSource(this.cartasConLaboratorio);
               this.dataSource.paginator = this.paginator;
               this.dataSource.sort = this.sort;

               this.dataSource.filterPredicate = (data: any, filter: string) => {
               const dataStr = (
                data.nombreData +
                ' ' +
               data.nombre +
               ' ' +
               data.cantidad +
               ' ' +
               (data.disponible ? 'disponible' : 'no disponible')
               ).toLowerCase();
               return dataStr.includes(filter);
             };
            },
          });
        },
      });
  }

  updatePageSize(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newSize = parseInt(input.value, 10);
    if (newSize > 0) {
      this.pageSize = newSize;
      this.paginaActual = 1; // Siempre vuelve a la primera página
      this.paginator.pageSize = newSize;
      this.paginator.firstPage();

      this.cargarCartas();
    }
  }

 
agregarAlCarrito(carta: any): void {
  const cartaConCantidad = {
    ...carta,
    cantidadSeleccionada: 1
  };

  this.carritoService.agregar(cartaConCantidad);
  this.toastr.success('Producto añadido al carrito!', '');
}



    applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
  this.paginator.page.subscribe((event: PageEvent) => {
    this.paginaActual = event.pageIndex + 1; // recordando que pageIndex empieza en 0
    this.pageSize = event.pageSize;
    this.cargarCartas();
  });
}

}
