import { Injectable } from "@angular/core";
import { Carta } from "../../../interfaces/carta";
import { CartaCarrito } from "./cartaCarrito.interface";

@Injectable({
    providedIn: 'root'
})

export class CarritoService {
    private carrito: CartaCarrito[] = [];
    

    constructor(){
      const guardado = localStorage.getItem('carrito');
      this.carrito = guardado ? JSON.parse(guardado) : [];
    }

    getCarrito(): CartaCarrito[] {
     const guardado = localStorage.getItem('carrito');
     return guardado ? JSON.parse(guardado) : this.carrito;
    }


 agregar(carta: CartaCarrito): void {
  const yaExiste = this.carrito.find(item => item.id === carta.id);

  if (!yaExiste) {
    this.carrito.push(carta);
    this.guardarCarrito();
  }
}

actualizarCantidad(id: number, nuevaCantidad: number): void {
  const index = this.carrito.findIndex(item => item.id === id);
  if (index !== -1) {
    this.carrito[index].cantidadSeleccionada = nuevaCantidad;
    this.guardarCarrito();
  }
}



eliminarDelCarrito(id: number): void {
  this.carrito = this.carrito.filter(item => item.id !== id);
  this.guardarCarrito();
}

vaciarCarrito(): void {
  this.carrito = [];
  this.guardarCarrito();
}

private guardarCarrito(): void {
  localStorage.setItem('carrito', JSON.stringify(this.carrito));
}


}