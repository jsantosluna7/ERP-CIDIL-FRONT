import { Component, OnInit, ViewChild } from '@angular/core';
import { Carta } from '../../../interfaces/carta';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../carrito/carrito.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { InventarioService } from '../../../services/Inventario/inventario.service';

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
    MatIconModule, ],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit {

  pageSize = 20;
  totalItems = 0;
  paginaActual = 1;

  cartas: Carta[] = [];
  cartasFiltradas: Carta[] =[];

  
   /* ---------- Paginacion ------------ */

 

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    private inventarioService: InventarioService,
    private carritoService: CarritoService,
    private toastr: ToastrService
  ){}

  dataSource = new MatTableDataSource<any>([]);

ngOnInit(): void {
  this.inventarioService.getCartas(this.paginaActual, this.pageSize).subscribe((data: any) => {
    this.cartas = data.datos;
    this.cartasFiltradas = this.cartas;
    this.dataSource = new MatTableDataSource(this.cartas);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

     // Establecer el filtro personalizado
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const dataStr = (
        data.nombre +
        ' ' +
        data.descripcionLarga +
        ' ' +
        data.cantidad +
        ' ' +
        (data.disponible ? 'activo' : 'inactivo')
      ).toLowerCase();
      return dataStr.includes(filter);
    };
  });
}

 /* ngOnInit(): void {
  this.inventarioService.getCartas().subscribe((data: any) => {
    this.cartas = data.datos
  console.log(data)
  }); // ← devuelve el arreglo directamente
  this.dataSource = new MatTableDataSource(this.cartas);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort; 
  }*/
  
  updatePageSize(event: Event): void {
  const input = event.target as HTMLInputElement;
  const newSize = parseInt(input.value, 10);
  if (newSize > 0) {
    this.pageSize = newSize;
    this.paginaActual = 1; // Siempre vuelve a la primera página
    this.paginator.pageSize = newSize;
    this.paginator.firstPage();

    this.inventarioService.getCartas(this.paginaActual, this.pageSize).subscribe((data: any) => {
      this.cartas = data.datos;
      this.cartasFiltradas = this.cartas;
      this.dataSource = new MatTableDataSource(this.cartas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(data);
    });
  }
}


   /*updatePageSize(event: Event) {
    const input = event.target as HTMLInputElement;
    const newSize = parseInt(input.value, 10);
    if (newSize > 0) {
      this.pageSize = newSize;
      this.paginator.pageSize = newSize;
      this.inventarioService.getCartas().subscribe((data: any) => {
        this.cartas = data.datos
        console.log(data)
      });
    }
  }*/

  agregarAlCarrito(carta: Carta): void {
    this.carritoService.agregar(carta);
    console.log('Producto agregado', this.cartas);
    this.toastr.success('Producto añadido al carrito!', '')
  }

  

 applyFilter(event: Event): void {
  const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  this.dataSource.filter = filterValue;
}

/*applyFilter(event: Event): void {
  const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
  this.cartasFiltradas = this.cartas.filter(carta =>
    (carta.nombre?.toLowerCase().includes(filterValue) || '') ||
    (carta.descripcionLarga?.toLowerCase().includes(filterValue) || '') ||
    String(carta.cantidad).includes(filterValue) ||
    (carta.disponible ? 'activo' : 'inactivo').includes(filterValue)
  );
}*/

  



}
