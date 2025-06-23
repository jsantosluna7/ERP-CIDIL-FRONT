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

   /* agregar(carta: Carta): void {
        this.carrito.push(carta);
    }*/

    /*agregar(carta: Carta): void {
    const yaExiste = this.carrito.find(item => item.id === carta.id);

    if (!yaExiste) {
      const cartaConCantidad: CartaCarrito = {
        ...carta,
        cantidadSeleccionada: 1
      };
      this.carrito.push(cartaConCantidad);
    }
  }*/
 agregar(carta: Carta): void {
  const yaExiste = this.carrito.find(item => item.id === carta.id);

  if (!yaExiste) {
    const cartaConCantidad: CartaCarrito = {
      ...carta,
      cantidadSeleccionada: 1
    };
    this.carrito.push(cartaConCantidad);
    this.guardarCarrito();
  }
}

    /*eliminarDelCarrito(id: number): void {
        this.carrito =this.carrito.filter(item => item.id !==id);
        
    }

    vaciarCarrito(): void {
        this.carrito =[];
    }*/


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