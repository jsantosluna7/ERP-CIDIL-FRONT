import { Injectable } from "@angular/core";
import { Carta } from "../../../interfaces/carta";

@Injectable({
    providedIn: 'root'
})

export class CarritoService {
    private carrito: Carta[] = [];

    getCarrito(): Carta[]{
        return this.carrito;
    }

    agregar(carta: Carta): void {
        this.carrito.push(carta);
    }

    eliminarDelCarrito(id: number): void {
        this.carrito =this.carrito.filter(item => item.id !==id);
    }

    vaciarCarrito(): void {
        this.carrito =[];
    }






}