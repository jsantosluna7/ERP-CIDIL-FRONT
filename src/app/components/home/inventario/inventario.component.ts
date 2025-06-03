import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
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


  constructor(private _inventario: InventarioService) { }


  ngOnInit(): void {
    // this.cartas = this.inventarioService.getCartas(); // ← devuelve el arreglo directamente
    
    this._inventario.getInventario().subscribe(e => {
      console.log(e);
    })

  }

  getInventario(){
    this._inventario.getInventario().subscribe(e => {
      console.log(e)
    })
  }

}
