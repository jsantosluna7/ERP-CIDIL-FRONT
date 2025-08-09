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
import { ReporteFallaService } from '../../../services/Api/ReporteFalla/reporteFalla.service';
import { ReporteFalla } from '../../../interfaces/reporteFalla.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-reportes',
  imports: [
    FontAwesomeModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterLink,
    AppCualRolDirective,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css',
})
export class ReportesComponent {
  laboratoriosSelect: any[] = [];

  laboratorios: Laboratorio[] = [];
  solicitudesForm!: FormGroup;
  faUser = faUser;
  faLocationDot = faLocationDot;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  fahouse = faHome;
  faclock = faClock;
  estado = faHourglass;

  constructor(
    private laboratorioService: LaboratorioService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private _usuarios: UsuariosService,
    private reporteFallaService: ReporteFallaService
  ) {}

  usuarioLogueado: any;

  ngOnInit(): void {
    this.solicitudesForm = this.fb.group({
      idLaboratorio: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      lugar: ['', Validators.required],
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

  enviarReporte(): void {
    const idLaboratorio = Number(
      this.solicitudesForm.get('idLaboratorio')?.value
    );
    const lugar = this.solicitudesForm.get('lugar')?.value;
    const descripcion = this.solicitudesForm.get('descripcion')?.value;

    if (!idLaboratorio && (!lugar || lugar.trim() === '')) {
      this.toastr.warning(
        'Debe seleccionar un laboratorio o indicar un lugar.',
        'Atención'
      );
      return;
    }

    if (!descripcion || descripcion.trim() === '') {
      this.toastr.warning(
        'Debe ingresar la descripción de la falla.',
        'Atención'
      );
      return;
    }

    const nombreSolicitante = `${this.usuarioLogueado.nombreUsuario} ${this.usuarioLogueado.apellidoUsuario}`;

    const reporte: ReporteFalla = {
      idLaboratorio: idLaboratorio || null,
      lugar: lugar || null,
      descripcion: descripcion,
      nombreSolicitante: nombreSolicitante,
      idEstado: 1,
    };

    this.reporteFallaService.crearReporte(reporte).subscribe({
      next: () => {
        this.toastr.success('¡Reporte enviado correctamente!', 'Éxito');
        this.solicitudesForm.reset();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Error al enviar el reporte', 'Error');
      },
    });
  }

  obtenerDescripcionLaboratorio(id: number): string {
    console.log('ID del laboratorio seleccionado:', id);
    const laboratorio = this.laboratorios.find((lab) => lab.id == id);

    return laboratorio?.descripcion.trimStart() || '';
  }
}
