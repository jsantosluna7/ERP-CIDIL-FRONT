import { Component, OnInit } from '@angular/core';
import { CarritoService } from './carrito.service';
import { Carta } from '../../../interfaces/carta';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-carrito',
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {


  carrito: Carta[] = [];

  constructor(private carritoService: CarritoService, private router: Router, private toastr: ToastrService){}

  ngOnInit(): void {
  this.carrito = this.carritoService.getCarrito();
  console.log('Contenido del carrito:', this.carrito);
}
  

  eliminar(id: number){
    this.carritoService.eliminarDelCarrito(id);
    this.carrito = this.carritoService.getCarrito();
    this.toastr.success('Producto eliminado del carrito!', '')
  }

  vaciar(){
    this.carritoService.vaciarCarrito();
    this.carrito = [];
    this.toastr.success('El carro ya esta limpio!', '')
  }

  ruta(){
    this.router.navigate(['/home/reserva-equipo']);
  }
}
