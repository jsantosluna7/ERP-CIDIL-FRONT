import { Component, OnInit } from '@angular/core';
import { Carta } from '../../../interfaces/carta';
import { InventarioService } from './inventario.service';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../carrito/carrito.service';

@Component({
  selector: 'app-inventario',
  imports: [CommonModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit {
  cartas: Carta[] = [];

  constructor(private inventarioService: InventarioService, private carritoService: CarritoService){}


  ngOnInit(): void {
    this.cartas = this.inventarioService.getCartas();
    
  }

  agregarAlCarrito(carta: Carta): void {
    this.carritoService.agregar(carta);
    console.log('Producto agregado', this.cartas);
  }
}
