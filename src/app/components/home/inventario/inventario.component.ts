import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
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
    MatIconModule,],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit {

  datos: any[] = [];


  constructor(private inventarioService: InventarioService, private carritoService: CarritoService, private toastr: ToastrService, private _inventario: InventarioService){}


  ngOnInit(): void {
  this.inventarioService.getCartas().subscribe(data => {this.cartas = data}); // ← devuelve el arreglo directamente
  this.dataSource = new MatTableDataSource(this.cartas);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
    
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

  agregarAlCarrito(carta: Carta): void {
    this.carritoService.agregar(carta);
    console.log('Producto agregado', this.cartas);
    this.toastr.success('Producto añadido al carrito!', '')
  }

  

applyFilter(event: Event): void {
  const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
  this.cartasFiltradas = this.cartas.filter(carta =>
    (carta.nombre?.toLowerCase().includes(filterValue) || '') ||
    (carta.descripcion?.toLowerCase().includes(filterValue) || '') ||
    String(carta.cantidad).includes(filterValue) ||
    (carta.estado ? 'activo' : 'inactivo').includes(filterValue)
  );
}




}
