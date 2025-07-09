import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Carta } from '../../../interfaces/carta';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../carrito/carrito.service';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { InventarioService } from '../../../services/Inventario/inventario.service';
import { MatCardModule } from '@angular/material/card';
import { LaboratorioService } from '../../../services/Laboratorio/laboratorio.service';
import { Laboratorio } from '../../../interfaces/laboratorio.interface';


import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActualizarcartaComponent } from './actualizarcarta/actualizarcarta.component';
import { MatDialog } from '@angular/material/dialog';
import { AppCualRolDirective } from '../../../directives/app-cual-rol.directive';
import { FormsModule } from '@angular/forms';

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
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule, AppCualRolDirective, FormsModule
  ],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css',
})
export class InventarioComponent implements OnInit, AfterViewInit {

  loading: boolean = true;

  pageSize = 20;
  totalItems: number = 0;
  paginaActual = 1;
  textoFiltro: string = '';
  cartas: Carta[] = [];
  cartasConLaboratorio: any[] = [];
  cartasFiltradas: Carta[] = [];
  laboratorios: Laboratorio[] = [];

  /* ---------- Paginacion ------------ */

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private inventarioService: InventarioService,
    private carritoService: CarritoService,
    private toastr: ToastrService,
    private laboratorioService: LaboratorioService,
    private dialog: MatDialog
  ) {}

  dataSource = new MatTableDataSource<any>([]);

  ngOnInit(): void {
    this.loading = true;
    this.laboratorioService.getLaboratorios().subscribe((labs: Laboratorio[]) => {
      this.laboratorios =labs;
       this.cargarCartas();
    })
        
  }



cargarCartas(): void {
  this.loading = true;

  this.inventarioService.getCartas(this.paginaActual, this.pageSize).subscribe({
    next: (d: any) => {

      let datosFiltrados = d.datos.filter((data: any) => data.disponible);

      // Aplica filtro si hay texto escrito
      if (this.textoFiltro) {
        const filtro = this.textoFiltro.toLowerCase();

        datosFiltrados = datosFiltrados.filter((data: any) => {
          const lab = this.laboratorios.find(l => l.id === data.idLaboratorio);
          const nombreLab = lab ? lab.codigoDeLab.toLowerCase() : 'sin laboratorio';

          const dataStr = (
            data.nombre +
            ' ' +
            nombreLab +
            ' ' +
            data.cantidad +
            ' ' +
            (data.disponible ? 'disponible' : 'no disponible')
          ).toLowerCase();

          return dataStr.includes(filtro);
        });
      }

      //  Mapear los datos con información del laboratorio
      this.cartasConLaboratorio = datosFiltrados.map((data: any) => {
        const lab = this.laboratorios.find(l => l.id === data.idLaboratorio);
        return {
          id: data.id,
          nombre: lab ? lab.codigoDeLab : 'Sin laboratorio',
          nombreData: data.nombre,
          cantidad: data.cantidad,
          disponible: data.disponible,
          imagen: data.imagenEquipo
        };
      });

      //  Actualiza el total desde el backend
      this.totalItems = d.paginacion?.totalInventario ?? 0;

      //  Sincroniza visualmente el paginador
      if (this.paginator) {
        this.paginator.pageIndex = this.paginaActual - 1;
      }

      this.loading = false;
    },
    error: () => {
      this.loading = false;
      this.toastr.error('Error al cargar los datos');
    }
  });
}


  updatePageSize(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newSize = parseInt(input.value, 10);

    if (newSize > 0) {
       this.loading = true;
      this.pageSize = newSize;
      this.paginaActual =1;
      //this.paginator.pageSize = newSize;
      this.cargarCartas();
       this.paginator.firstPage();
      
    }
  }


 
agregarAlCarrito(carta: any): void {
  const cantidad = carta.cantidadSeleccionada;

  if (!cantidad || cantidad <= 0 || cantidad > carta.cantidad) {
    this.toastr.error('Cantidad inválida', '');
    return;
  }

  const cartaConCantidad = {
    ...carta,
    cantidadSeleccionada: cantidad
  };

  this.carritoService.agregar(cartaConCantidad);
  this.toastr.success('Producto añadido al carrito!', '');

  // Limpia el input después
  carta.cantidadSeleccionada = null;
}


applyFilter(event: Event): void {
  const input = event.target as HTMLInputElement;
  this.textoFiltro = input.value.trim().toLowerCase();
  this.paginaActual = 1; // Opcional: volver a la primera página
  this.cargarCartas();
}


   /* applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
  }*/



  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator
  //this.paginator.page.subscribe((event: PageEvent) => {
    //this.paginaActual = event.pageIndex + 1;
   // this.pageSize = event.pageSize;
    //this.cargarCartas();
  //});
}

onPageChange(event: PageEvent): void {
  this.loading = true;
  this.pageSize = event.pageSize;
  this.paginaActual = event.pageIndex + 1;
  this.cargarCartas();
  

}

abrirDialogoEditar(carta: any): void {
  this.inventarioService.obtenerCartaPorId(carta.id).subscribe({
    next: detalleCompleto => {
      const dialogRef = this.dialog.open(ActualizarcartaComponent, {
        width: '400px',
        data: detalleCompleto
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Actualizar la lista local con el equipo modificado
          const index = this.cartasConLaboratorio.findIndex(c => c.id === result.id);
          if (index !== -1) {
            this.cartasConLaboratorio[index] = result;
            this.toastr.success('Carta actualizada correctamente', '');
          }
        }
      });
    },
    error: err => {
      console.error('Error al obtener detalles de la carta:', err);
      this.toastr.error('No se pudo cargar el detalle del equipo para editar', 'Error');
    }
  });
}








}
