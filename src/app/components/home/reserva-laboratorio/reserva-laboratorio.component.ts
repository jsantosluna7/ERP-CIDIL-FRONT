import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faLocationDot, faPhone, faUser,faHome,faClock, faHourglass } from '@fortawesome/free-solid-svg-icons';
import { Laboratorio } from '../../../interfaces/laboratorio.interface';
import { LaboratorioService } from '../../../services/Laboratorio/laboratorio.service';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-reserva-laboratorio',
  imports: [FontAwesomeModule, ReactiveFormsModule,MatButtonModule, RouterLink],
  templateUrl: './reserva-laboratorio.component.html',
  styleUrl: './reserva-laboratorio.component.css'
})
export class ReservaLaboratorioComponent {

  laboratoriosSelect: any[]=[];

  laboratorios: Laboratorio[]=[];
  solicitudesForm!: FormGroup;
  faUser = faUser;
  faLocationDot = faLocationDot;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  fahouse= faHome;
  faclock = faClock;
  estado =faHourglass;


 constructor(private laboratorioService: LaboratorioService, private toastr: ToastrService, private fb: FormBuilder, private router: Router){}

 /*ngOnInit(): void {
    this.laboratorioService.getLaboratorios().subscribe({
      next: (data) => {
        this.laboratorios = data;
        console.log(data)
      },
      error: (err) => {
        console.error('Error al obtener laboratorios', err);
      }
    });
  }*/

    ngOnInit(): void {
  // Inicializa el formulario
  this.solicitudesForm = this.fb.group({
    laboratorioId: ['', Validators.required],
    fechaInicio: ['', Validators.required],
    fechaDevolucion: ['', Validators.required],
    motivo: ['', Validators.required],
    comentarioAprobacion: [''],
    aprobacion: [null, Validators.required]
  });

  // Carga los laboratorios
  this.laboratorioService.getLaboratorios().subscribe({
    next: (data) => {
      this.laboratorios = data;
      
    },
    error: (err) => {
      console.error('Error al obtener laboratorios', err);
    }
  });
}


/*enviarSolicitud(){
 if (this.solicitudesForm.invalid) {
      this.toastr.error('Debe completar todos los campos obligatorios');
      return;
    }

    const solicitud = this.solicitudesForm.value;

    this.laboratorioService.enviarSolicitud(solicitud).subscribe({
      next: () => {
        this.toastr.success('Solicitud enviada correctamente');
        this.solicitudesForm.reset();
      },
      error: (err) => {
        console.error('Error al enviar la solicitud', err);
        this.toastr.error('Error al enviar la solicitud');
      }
    });
  }*/

    enviarSolicitud(): void {
  const fechaInicio = this.solicitudesForm.get('fechaInicio')?.value;
  const fechaFin = this.solicitudesForm.get('fechaDevolucion')?.value;
  const laboratorioId = this.solicitudesForm.get('laboratorioId')?.value;
  const motivo = this.solicitudesForm.get('motivo')?.value;
  const aprobacion = Number (this.solicitudesForm.get('aprobacion')?.value);
  console.log(aprobacion);


  // Validaciones paso a paso con toastr
  if (!laboratorioId) {
    this.toastr.warning('Debe seleccionar un laboratorio.', 'Atención');
    return;
  }

  if (!fechaInicio) {
    this.toastr.warning('Debe seleccionar la fecha de inicio.', 'Atención');
    return;
  }

  if (!fechaFin) {
    this.toastr.warning('Debe seleccionar la fecha de finalización.', 'Atención');
    return;
  }

  if (!motivo || motivo.trim() === '') {
    this.toastr.warning('Debe ingresar el motivo de la reserva.', 'Atención');
    return;
  }

 
  // Validar formulario completo
  if (this.solicitudesForm.invalid) {
    this.toastr.error('El formulario tiene errores. Revise los campos.', 'Error');
    return;
  }

  // Si todo está correcto, preparar la solicitud
  const solicitud = {
    ...this.solicitudesForm.value
  };

  console.log('Solicitud enviada:', solicitud);

  // Aquí harías el envío real al servicio (si ya lo tienes implementado)
  this.laboratorioService.enviarSolicitud(solicitud).subscribe({
    next: () => {
      this.toastr.success('¡Solicitud enviada correctamente!', 'Éxito');
      this.solicitudesForm.reset(); // Limpiar el formulario si deseas
      this.laboratoriosSelect = []; // Limpiar equipos
    },
    error: (err) => {
      console.error(err);
      this.toastr.error('Ocurrió un error al enviar la solicitud.', 'Error');
    }
  });
}


 ruta(){
    this.router.navigate(['/home/solicitud-laboratorio']);
    console.log(this.router)
  }






}

