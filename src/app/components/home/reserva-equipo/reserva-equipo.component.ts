import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClock, faEnvelope, faHome, faLocationDot, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { Carta } from '../../../interfaces/carta';
import { CarritoService } from '../carrito/carrito.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-reserva-equipo',
  imports: [FontAwesomeModule,ReactiveFormsModule],
  templateUrl: './reserva-equipo.component.html',
  styleUrl: './reserva-equipo.component.css'
})
export class ReservaEquipoComponent implements OnInit {

  solicitudesForm!: FormGroup;
  equiposSeleccionados: Carta[] = [];


  faUser = faUser;
  faLocationDot = faLocationDot;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  fahouse= faHome;
  faclock = faClock;

 



 constructor(private carritoService: CarritoService, private fb: FormBuilder) {}

 ngOnInit(): void {
  this.equiposSeleccionados = this.carritoService.getCarrito();

  this.solicitudesForm = this.fb.group({
    fechaInicio: ['', Validators.required],
    fechaDevolucion: ['',Validators.required],
    motivo: [''],
  });
 }

 enviarSolicitud(): void {
  if(this.solicitudesForm.valid){
    const solicitud ={
      ...this.solicitudesForm.value,
      equipos: this.equiposSeleccionados
    }
  }else{
    console.log('Solicitud invalida');
    this.solicitudesForm.markAllAsTouched();
  }

 }




}
