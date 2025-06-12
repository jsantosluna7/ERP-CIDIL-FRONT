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

 constructor(private carritoService: CarritoService, private toastr: ToastrService, private router: Router) {
    this.solicitudesForm = new FormGroup({
    fechaInicio: new FormControl('', [Validators.required]),
    fechaDevolucion: new FormControl('',[Validators.required]),
    Motivo: new FormControl('', [Validators.min(1)]),
  });
 }

 ngOnInit(): void {
  this.equiposSeleccionados = this.carritoService.getCarrito();
 }

 enviarSolicitud(): void {
  const fechaInicio = this.solicitudesForm.get('fechaInicio')?.value;
  const fechaFin = this.solicitudesForm.get('fechaDevolucion')?.value;


   if (this.equiposSeleccionados.length === 0) {
     this.toastr.error('Debe seleccionar al menos un equipo!', '')
    return;
  }

  if (!fechaInicio) {
     this.toastr.error('El campo "Fecha de inicio" está vacío!', '')
    return;
  }

  if (!fechaFin) {
     this.toastr.error('El campo "Fecha de fin" está vacío!', '')
    return;
  }

  // Si pasa todas las validaciones, se envía la solicitud
  if (this.solicitudesForm.valid) {
    const solicitud = {
      ...this.solicitudesForm.value,
      equipos: this.equiposSeleccionados
    };
    this.toastr.success('Solicitud enviada!', '') 
  }
 }


 ruta(){
    this.router.navigate(['/home/solicitud-laboratorio']);
    console.log(this.router)
  }

}
