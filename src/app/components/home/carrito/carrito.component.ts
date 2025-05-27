import { Component, OnInit } from '@angular/core';
import { CarritoService } from './carrito.service';
import { Carta } from '../../../interfaces/carta';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-carrito',
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {


  carrito: Carta[] = [];

  constructor(private carritoService: CarritoService, private router: Router){}

  ngOnInit(): void {
  this.carrito = this.carritoService.getCarrito();
  console.log('Contenido del carrito:', this.carrito);
}
  

  eliminar(id: number){
    this.carritoService.eliminarDelCarrito(id);
    this.carrito = this.carritoService.getCarrito();
  }

  vaciar(){
    this.carritoService.vaciarCarrito();
    this.carrito = [];
  }

  ruta(){
    this.router.navigate(['/home/reserva-equipo']);
  }
}
