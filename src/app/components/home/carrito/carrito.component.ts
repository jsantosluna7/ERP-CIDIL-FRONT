import { Component, OnInit } from '@angular/core';
import { CarritoService } from './carrito.service';
import { Carta } from '../../../interfaces/carta';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CartaCarrito } from './cartaCarrito.interface';


@Component({
  selector: 'app-carrito',
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {


  carrito: any[] = [];

  constructor(private carritoService: CarritoService, private router: Router, private toastr: ToastrService){}

  ngOnInit(): void {
  this.carrito = this.carritoService.getCarrito();
}


  actualizarCantidad(carta: any): void {
  
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
