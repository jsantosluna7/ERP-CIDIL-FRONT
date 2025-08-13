import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEnvelope,
  faLocationDot,
  faPhone,
  faUser,
  faHome,
  faClock,
  faHourglass,
  faAudioDescription,
} from '@fortawesome/free-solid-svg-icons';
import {
  Laboratorio,
  SolicitudReserva,
} from '../../../interfaces/laboratorio.interface';
import { LaboratorioService } from '../../../services/Laboratorio/laboratorio.service';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';
import { AppCualRolDirective } from '../../../directives/app-cual-rol.directive';

@Component({
  selector: 'app-reserva-laboratorio',
  imports: [
    FontAwesomeModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterLink,
    AppCualRolDirective,
  ],
  templateUrl: './reserva-laboratorio.component.html',
  styleUrl: './reserva-laboratorio.component.css',
})
export class ReservaLaboratorioComponent {
  laboratoriosSelect: any[] = [];

  laboratorios: Laboratorio[] = [];
  solicitudesForm!: FormGroup;
  faUser = faUser;
  faLocationDot = faLocationDot;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  fahouse = faHome;
  faclock = faClock;
  faDesc = faAudioDescription
  estado = faHourglass;

  constructor(
    private laboratorioService: LaboratorioService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private _usuarios: UsuariosService
  ) {}

  usuarioLogueado: any;

  ngOnInit(): void {
    this.solicitudesForm = this.fb.group({
      idLaboratorio: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFinal: ['', Validators.required],
      motivo: ['', Validators.required],
      //aprobacion: [null, Validators.required]
    });

    this._usuarios.user$.subscribe((user) => {

      this.usuarioLogueado = user;
    });

    this.laboratorioService.getLaboratorios().subscribe({
      next: (data) => {
        this.laboratorios = data;
      },
      error: (err) => {
        console.error('Error al obtener laboratorios', err);
      },
    });
  }

  enviarSolicitud(): void {
    const idLaboratorio = Number(
      this.solicitudesForm.get('idLaboratorio')?.value
    );
    //const horaInicio = this.solicitudesForm.get('horaInicio')?.value;
    //const horaFinal = this.solicitudesForm.get('horaFinal')?.value;
    const motivo = this.solicitudesForm.get('motivo')?.value;
    //const aprobacion = Number(this.solicitudesForm.get('aprobacion')?.value);

    const form = this.solicitudesForm.value;
    // Convertimos los campos datetime-local
    const dtInicio = new Date(form.horaInicio);
    const dtFinal = new Date(form.horaFinal);
    const horaInicio = dtInicio.toTimeString().split(' ')[0]; // HH:mm:ss
    const horaFinal = dtFinal.toTimeString().split(' ')[0];
    const fechaInicio = dtInicio.toISOString().split('T')[0] + 'T00:00:00';
    const fechaFinal = dtFinal.toISOString().split('T')[0] + 'T00:00:00';

    // Validaciones paso a paso con toastr
    if (!idLaboratorio) {
      this.toastr.warning('Debe seleccionar un laboratorio.', 'Atención');
      return;
    }

    if (!horaInicio) {
      this.toastr.warning('Debe seleccionar la hora de inicio.', 'Atención');
      return;
    }

    if (!horaFinal) {
      this.toastr.warning(
        'Debe seleccionar la hora de finalización.',
        'Atención'
      );
      return;
    }

    if (!motivo || motivo.trim() === '') {
      this.toastr.warning('Debe ingresar el motivo de la reserva.', 'Atención');
      return;
    }

    // Validar formulario completo
    if (this.solicitudesForm.invalid) {
      this.toastr.error(
        'El formulario tiene errores. Revise los campos.',
        'Error'
      );
      return;
    }

    // Si todo está correcto, preparar la solicitud

    const solicitud = {
      idUsuario: Number(this.usuarioLogueado.sub),
      idLaboratorio: Number(idLaboratorio),
      horaInicio: horaInicio,
      horaFinal: horaFinal,
      fechaInicio: fechaInicio, // Mismo valor que horaInicio
      fechaFinal: fechaFinal, // Mismo valor que horaFinal
      motivo: motivo,
      fechaSolicitud: new Date().toISOString(),
    };

    // Envío real al servicio
    this.laboratorioService.enviarSolicitud(solicitud).subscribe({
      next: () => {
        this.toastr.success('¡Solicitud enviada correctamente!', 'Éxito');
        this.solicitudesForm.reset();
        this.laboratoriosSelect = [];
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(err.error, 'Error');
      },
    });
  }

  obtenerDescripcionLaboratorio(id: number): string {
    const laboratorio = this.laboratorios.find((lab) => lab.id == id);

    return laboratorio?.descripcion.trimStart() || '';
  }

  ruta() {
    this.router.navigate(['/home/solicitud-laboratorio']);
  }
}
