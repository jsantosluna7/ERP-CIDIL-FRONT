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
            nombre: 'Panes',
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
         {
            id: 7,
            nombre: 'Mouse Logitech',
            descripcion: 'Mouse inalámbrico USB',
            cantidad: 10,
            estado: true,
            imagenUrl: '/Imagenes/b28877eeb2256c4a9be79f20ac04409b.jpg'
        },
         {
            id: 8,
            nombre: 'Mouse Logitech',
            descripcion: 'Mouse inalámbrico USB',
            cantidad: 10,
            estado: true,
            imagenUrl: '/Imagenes/b28877eeb2256c4a9be79f20ac04409b.jpg'
        }
        ,
         {
            id: 9,
            nombre: 'Mouse Logitech',
            descripcion: 'Mouse inalámbrico USB',
            cantidad: 10,
            estado: true,
            imagenUrl: '/Imagenes/b28877eeb2256c4a9be79f20ac04409b.jpg'
        },
         {
            id: 10,
            nombre: 'Mouse Logitech',
            descripcion: 'Mouse inalámbrico USB',
            cantidad: 10,
            estado: true,
            imagenUrl: '/Imagenes/b28877eeb2256c4a9be79f20ac04409b.jpg'
        },
         {
            id: 11,
            nombre: 'Mouse Logitech',
            descripcion: 'Mouse inalámbrico USB',
            cantidad: 10,
            estado: true,
            imagenUrl: '/Imagenes/b28877eeb2256c4a9be79f20ac04409b.jpg'
        },
         {
            id: 12,
            nombre: 'Mouse Logitech',
            descripcion: 'Mouse inalámbrico USB',
            cantidad: 10,
            estado: true,
            imagenUrl: '/Imagenes/b28877eeb2256c4a9be79f20ac04409b.jpg'
        },
         {
            id: 13,
            nombre: 'Mouse Logitech',
            descripcion: 'Mouse inalámbrico USB',
            cantidad: 10,
            estado: true,
            imagenUrl: '/Imagenes/b28877eeb2256c4a9be79f20ac04409b.jpg'
        },
         {
            id: 14,
            nombre: 'Mouse Logitech',
            descripcion: 'Mouse inalámbrico USB',
            cantidad: 10,
            estado: true,
            imagenUrl: '/Imagenes/b28877eeb2256c4a9be79f20ac04409b.jpg'
        },
         {
            id: 15,
            nombre: 'Mouse Logitech',
            descripcion: 'Mouse inalámbrico USB',
            cantidad: 10,
            estado: true,
            imagenUrl: '/Imagenes/b28877eeb2256c4a9be79f20ac04409b.jpg'
        },
         {
            id: 16,
            nombre: 'Mouse Logitech',
            descripcion: 'Mouse inalámbrico USB',
            cantidad: 10,
            estado: true,
            imagenUrl: '/Imagenes/b28877eeb2256c4a9be79f20ac04409b.jpg'
        },
         {
            id: 17,
            nombre: 'Mouse Logitech',
            descripcion: 'Mouse inalámbrico USB',
            cantidad: 10,
            estado: true,
            imagenUrl: '/Imagenes/b28877eeb2256c4a9be79f20ac04409b.jpg'
        },
         {
            id: 18,
            nombre: 'Mouse Logitech',
            descripcion: 'Mouse inalámbrico USB',
            cantidad: 10,
            estado: true,
            imagenUrl: '/Imagenes/b28877eeb2256c4a9be79f20ac04409b.jpg'
        },
         {
            id: 19,
            nombre: 'Mouse Logitech',
            descripcion: 'Mouse inalámbrico USB',
            cantidad: 10,
            estado: true,
            imagenUrl: '/Imagenes/b28877eeb2256c4a9be79f20ac04409b.jpg'
        },
         {
            id: 20,
            nombre: 'Mouse Logitech',
            descripcion: 'Mouse inalámbrico USB',
            cantidad: 10,
            estado: true,
            imagenUrl: '/Imagenes/b28877eeb2256c4a9be79f20ac04409b.jpg'
        },
         {
            id: 21,
            nombre: 'Mouse Logitech',
            descripcion: 'Mouse inalámbrico USB',
            cantidad: 10,
            estado: true,
            imagenUrl: '/Imagenes/b28877eeb2256c4a9be79f20ac04409b.jpg'
        },
         {
            id: 22,
            nombre: 'Mouse Logitech',
            descripcion: 'Mouse inalámbrico USB',
            cantidad: 10,
            estado: true,
            imagenUrl: '/Imagenes/b28877eeb2256c4a9be79f20ac04409b.jpg'
        },
         {
            id: 23,
            nombre: 'Mouse Logitech',
            descripcion: 'Mouse inalámbrico USB',
            cantidad: 10,
            estado: true,
            imagenUrl: '/Imagenes/b28877eeb2256c4a9be79f20ac04409b.jpg'
        },
         {
            id: 24,
            nombre: 'Mouse Logitech',
            descripcion: 'Mouse inalámbrico USB',
            cantidad: 10,
            estado: true,
            imagenUrl: '/Imagenes/b28877eeb2256c4a9be79f20ac04409b.jpg'
        }
        
    ];


    getCartas(): Carta[] {
        return this.cartas;
    }



}