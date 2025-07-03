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
import { LaboratorioService } from '../../../services/Laboratorio/laboratorio.service';
import { Laboratorio } from '../../../interfaces/laboratorio.interface';


import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatProgressSpinnerModule
  ],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css',
})
export class InventarioComponent implements OnInit, AfterViewInit {

  loading: boolean = true;

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
    this.loading = true;
    this.laboratorioService.getLaboratorios().subscribe((labs: Laboratorio[]) => {
      this.laboratorios =labs;
       this.cargarCartas();
    })
        
  }

  imagen(img: any): string{
    return `http://100.89.68.57:5000${img.imagen}`
  }

  cargarCartas() {
  this.loading = true;

  this.inventarioService.getCartas(this.paginaActual, this.pageSize).subscribe({
    next: (d: any) => {
      console.log(d);

      const all = d.datos;

      const datos = all
  .filter((data: any) => data.disponible)  
  .map((data: any) => {
    const lab = this.laboratorios.find(l => l.id === data.idLaboratorio);
    return {
      id: data.id,
      nombre: lab ? lab.codigoDeLab : 'Sin laboratorio',
      nombreData: data.nombre,
      cantidad: data.cantidad,
      disponible: data.disponible,
      imagen: data.imagenEquipo
    };
  });

      this.cartasConLaboratorio = datos;
      this.totalItems = d.total;
      this.loading = false;

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
    error: () => {
      this.loading = false;
      this.toastr.error('Error al cargar los datos');
    }
  });
}


 

  updatePageSize(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newSize = parseInt(input.value, 10);
    if (newSize > 0) {
       this.loading = true;
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
    cantidadSeleccionada: carta.cantidadSeleccionada?? 1
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
    this.paginaActual = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.cargarCartas();
  });
}

}
