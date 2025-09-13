import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-reserva-laboratorio',
  imports: [
    FontAwesomeModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterLink,
    AppCualRolDirective,
    MatProgressSpinnerModule,
  ],
  templateUrl: './reserva-laboratorio.component.html',
  styleUrl: './reserva-laboratorio.component.css',
})
export class ReservaLaboratorioComponent {
  laboratoriosSelect: any[] = [];
  loading = false;
  laboratorios: Laboratorio[] = [];
  solicitudesForm!: FormGroup;
  faUser = faUser;
  faLocationDot = faLocationDot;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  fahouse = faHome;
  faclock = faClock;
  faDesc = faAudioDescription;
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
      horaInicio: ['', [this.horaValida()]],
      horaFinal: ['', [this.horaValidaFinal()]],
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
    const motivo = this.solicitudesForm.get('motivo')?.value;
    const form = this.solicitudesForm.value;
    const dtInicio = new Date(form.horaInicio);
    // const dtFinal = new Date(form.horaFinal);
    const horaInicio = dtInicio.toTimeString().split(' ')[0]; // HH:mm:ss
    const horaFinal = `${form.horaFinal}:00`;
    const fechaInicio = dtInicio.toISOString().split('T')[0] + 'T00:00:00';
    const fechaFinal = fechaInicio;

    this.loading = true; // Activar el spinner

    // Validaciones paso a paso con toastr
    if (!idLaboratorio) {
      this.loading = false; // Desactivar el spinner
      this.toastr.warning('Debe seleccionar un laboratorio.', 'Atención');
      return;
    }

    if (!horaInicio) {
      this.loading = false; // Desactivar el spinner
      this.toastr.warning('Debe seleccionar la hora de inicio.', 'Atención');
      return;
    }

    if (!horaFinal) {
      this.loading = false; // Desactivar el spinner
      this.toastr.warning(
        'Debe seleccionar la hora de finalización.',
        'Atención'
      );
      return;
    }

    if (!motivo || motivo.trim() === '') {
      this.loading = false; // Desactivar el spinner
      this.toastr.warning('Debe ingresar el motivo de la reserva.', 'Atención');
      return;
    }

    // Validar formulario completo
    if (this.solicitudesForm.invalid) {
      this.loading = false; // Desactivar el spinner
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
        this.loading = false; // Desactivar el spinner
        this.toastr.success('¡Solicitud enviada correctamente!', 'Éxito');
        this.solicitudesForm.reset();
        this.laboratoriosSelect = [];
      },
      error: (err) => {
        this.loading = false; // Desactivar el spinner
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

  horaValida(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const fecha = new Date(control.value);
      const dia = fecha.getDay(); // 0=Domingo, 6=Sábado
      const hora = fecha.getHours();
      const minutos = fecha.getMinutes();

      // Domingo -> siempre inválido
      if (dia === 0) {
        return { horaInvalida: true };
      }

      let horaMax = 22; // por defecto Lunes-Viernes
      let minutoMax = 0;

      // Sábado -> hasta las 18:00
      if (dia === 6) {
        horaMax = 18;
        minutoMax = 0;
      }

      // Validaciones
      if (hora < 8) {
        return { horaInvalida: true };
      }

      if (hora > horaMax) {
        return { horaInvalida: true };
      }

      if (hora === horaMax && minutos > minutoMax) {
        return { horaInvalida: true };
      }

      return null; // válido
    };
  }

  horaValidaFinal(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const [horaStr, minutoStr] = control.value.split(':');
      const hora = parseInt(horaStr, 10);
      const minutos = parseInt(minutoStr, 10);

      if (isNaN(hora) || isNaN(minutos)) {
        return { formatoInvalido: true };
      }

      const hoy = new Date();
      const dia = hoy.getDay(); // 0=Domingo, 6=Sábado

      // Domingo -> siempre inválido
      if (dia === 0) {
        return { horaInvalida: true };
      }

      let horaMax = 22; // por defecto Lunes-Viernes
      let minutoMax = 0;

      // Sábado -> hasta las 18:00
      if (dia === 6) {
        horaMax = 18;
        minutoMax = 0;
      }

      // Validaciones
      if (hora < 8) {
        return { horaInvalida: true };
      }

      if (hora > horaMax) {
        return { horaInvalida: true };
      }

      if (hora === horaMax && minutos > minutoMax) {
        return { horaInvalida: true };
      }

      return null; // válido
    };
  }
}
