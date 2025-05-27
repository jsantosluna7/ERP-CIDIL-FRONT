import { Injectable } from "@angular/core";
import { Carta } from "../../../interfaces/carta";


@Injectable({
    providedIn: 'root'
})

export class InventarioService {

    private cartas: Carta[] =[
        {
            id: 1,
            nombre: 'Mouse Logitech',
            descripcion: 'Mouse inalámbrico USB',
            cantidad: 10,
            estado: true,
            imagenUrl: '/Imagenes/b28877eeb2256c4a9be79f20ac04409b.jpg'
        },
        {
            id: 2,
            nombre: 'Mouse Logitech',
            descripcion: 'Mouse inalámbrico USB',
            cantidad: 0,
            estado: false,
            imagenUrl: '/Imagenes/b28877eeb2256c4a9be79f20ac04409b.jpg'
        },
         {
            id: 3,
            nombre: 'Mouse Logitech',
            descripcion: 'Mouse inalámbrico USB',
            cantidad: 10,
            estado: true,
            imagenUrl: '/Imagenes/b28877eeb2256c4a9be79f20ac04409b.jpg'
        },
         {
            id: 4,
            nombre: 'Mouse Logitech',
            descripcion: 'Mouse inalámbrico USB',
            cantidad: 10,
            estado: true,
            imagenUrl: '/Imagenes/b28877eeb2256c4a9be79f20ac04409b.jpg'
        }, {
            id: 5,
            nombre: 'Mouse Logitech',
            descripcion: 'Mouse inalámbrico USB',
            cantidad: 10,
            estado: true,
            imagenUrl: '/Imagenes/b28877eeb2256c4a9be79f20ac04409b.jpg'
        },
         {
            id: 6,
            nombre: 'Mouse Logitech',
            descripcion: 'Mouse inalámbrico USB',
            cantidad: 10,
            estado: true,
            imagenUrl: '/Imagenes/b28877eeb2256c4a9be79f20ac04409b.jpg'
        },
        

    ];


    getCartas(): Carta[] {
        return this.cartas;
    }



}