import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClock, faEnvelope, faHome, faLocationDot, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { Carta } from '../../../interfaces/carta';
import { CarritoService } from '../carrito/carrito.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';
import { SolicitudEquipoService } from '../../../services/reserva-equipo/reserva-equipo.service';
import { ReservaEquipoNueva } from '../../../interfaces/reservaEquipoNueva.interface';
import { InventarioService } from '../../../services/Inventario/inventario.service';
import { AppCualRolDirective } from '../../../directives/app-cual-rol.directive';


@Component({
  selector: 'app-reserva-equipo',
  imports: [CommonModule, FontAwesomeModule,ReactiveFormsModule, RouterLink, MatButtonModule,AppCualRolDirective],
  templateUrl: './reserva-equipo.component.html',
  styleUrl: './reserva-equipo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservaEquipoComponent implements OnInit {

  solicitudesForm: FormGroup;
  equiposSeleccionados: Carta[] = [];


  faUser = faUser;
  faLocationDot = faLocationDot;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  fahouse= faHome;
  faclock = faClock;

 constructor(private carritoService: CarritoService, private toastr: ToastrService, private router: Router, private _usuarios: UsuariosService,private solicitudEquipoService: SolicitudEquipoService,private inventarioService: InventarioService  ) {
    this.solicitudesForm = new FormGroup({
    fechaInicio: new FormControl('', [Validators.required]),
    fechaDevolucion: new FormControl('',[Validators.required]),
    Motivo: new FormControl('', [Validators.min(1)]),
  });
 }

 usuarioLogueado: any;

 ngOnInit(): void {
  this.equiposSeleccionados = this.carritoService.getCarrito();

    //datos del usuario
   this._usuarios.user$.subscribe(user => {
    this.usuarioLogueado = user;
  });
 }

   enviarSolicitud(): void {
   this.equiposSeleccionados = this.carritoService.getCarrito(); 
  const fechaInicio = this.solicitudesForm.get('fechaInicio')?.value;
  const fechaFin = this.solicitudesForm.get('fechaDevolucion')?.value;
  const motivo = this.solicitudesForm.get('Motivo')?.value;

  if (this.equiposSeleccionados.length === 0) {
    this.toastr.error('Debe seleccionar al menos un equipo');
    return;
  }

  if (!fechaInicio || !fechaFin || !motivo) {
    this.toastr.error('Complete todos los campos requeridos');
    return;
  }

  const fechaSolicitud = new Date().toISOString();

  this.equiposSeleccionados.forEach((equipo) => {
    const solicitud: ReservaEquipoNueva = {
      idUsuario: Number(this.usuarioLogueado.sub),
      idInventario: equipo.id,
      fechaInicio,
      fechaFinal: fechaFin,
      motivo,
      fechaSolicitud,
      cantidad: equipo.cantidadSeleccionada
      
    };


     // Resta la cantidad
    const cantidadRestante = equipo.cantidad! - equipo.cantidadSeleccionada!;
    const equipoActualizado = {
      ...equipo,
      cantidad: cantidadRestante,
      disponible: cantidadRestante > 0
    };


    
    this.solicitudEquipoService.crearReserva(solicitud).subscribe({
      next: () => {
        this.toastr.success(`Solicitud para ${equipo.nombreData} enviada.`);
      
        this.inventarioService.obtenerCartaPorId(equipo.id).subscribe({
          next: (cartaCompleta) => {
            const cantidadRestante =
              (equipo.cantidad || 0) - (equipo.cantidadSeleccionada || 0);

            const equipoActualizado: Carta = {
              ...cartaCompleta,
              cantidad: cantidadRestante,
              disponible: cantidadRestante > 0
            };
            this.inventarioService.actualizarCarta(equipo.id, equipoActualizado).subscribe({
              next: () => {
                this.toastr.success('Equipo actualizado correctamente');
              },
              error: () => {
                this.toastr.error('Error al actualizar el inventario')
              }
            });
          },
          error: () => {
            this.toastr.error('No se pudo obtener la información completa del equipo');
          }
        });
      },
      error: (err) => {
        console.error(' Error al enviar la solicitud:', err);
        this.toastr.error('Error al enviar la solicitud');
      }
    });
  });

  this.carritoService.vaciarCarrito();
  this.solicitudesForm.reset();
}


 ruta(){
    this.router.navigate(['/home/inventario']);
  }

 







}
