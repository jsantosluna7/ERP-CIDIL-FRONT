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


@Component({
  selector: 'app-reserva-equipo',
  imports: [CommonModule, FontAwesomeModule,ReactiveFormsModule, RouterLink, MatButtonModule],
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

 constructor(private carritoService: CarritoService, private toastr: ToastrService, private router: Router, private _usuarios: UsuariosService,private solicituEquipoService: SolicitudEquipoService ) {
    this.solicitudesForm = new FormGroup({
    fechaInicio: new FormControl('', [Validators.required]),
    fechaDevolucion: new FormControl('',[Validators.required]),
    Motivo: new FormControl('', [Validators.min(1)]),
  });
 }

 usuarioLogueado: any;

 ngOnInit(): void {
  this.equiposSeleccionados = this.carritoService.getCarrito();
  console.log(this.equiposSeleccionados)

    //datos del usuario
   this._usuarios.user$.subscribe(user => {
    this.usuarioLogueado = user;
  });
 }

 enviarSolicitud(): void {
  const fechaInicio = this.solicitudesForm.get('fechaInicio')?.value;
  const fechaFin = this.solicitudesForm.get('fechaDevolucion')?.value;
  const motivo = this.solicitudesForm.get('Motivo')?.value;

  if (this.equiposSeleccionados.length === 0) {
    this.toastr.error('Debe seleccionar al menos un equipo!', '');
    return;
  }

  if (!fechaInicio || !fechaFin || !motivo) {
    this.toastr.error('Complete todos los campos requeridos!', '');
    return;
  }

  const fechaSolicitud = new Date().toISOString();

  // Enviar una solicitud por cada equipo
  this.equiposSeleccionados.forEach((equipo) => {
    const solicitud: ReservaEquipoNueva = {
      idUsuario: this.usuarioLogueado.id,
      idInventario: equipo.id,
      fechaInicio,
      fechaFinal: fechaFin,
      motivo,
      fechaSolicitud
    };

    this.solicituEquipoService.crearReserva(solicitud).subscribe({
      next: () => {
        this.toastr.success(`Solicitud para el equipo ${equipo.nombre} enviada.`, '');
      },
      error: (err) => {
        console.error('Error al enviar la solicitud:', err);
        this.toastr.error('Error al enviar la solicitud', '');
      }
    });
  });

  this.carritoService.vaciarCarrito();
}

 ruta(){
    this.router.navigate(['/home/solicitud-laboratorio']);
    console.log(this.router)
  }

 

}
