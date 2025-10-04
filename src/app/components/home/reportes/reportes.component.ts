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
import { MatProgressSpinner } from '@angular/material/progress-spinner';

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
    MatProgressSpinner
  ],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css',
})
export class ReportesComponent {
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
    this.loading = true;
    const idLaboratorio = Number(
      this.solicitudesForm.get('idLaboratorio')?.value
    );
    const lugar = this.solicitudesForm.get('lugar')?.value;
    const descripcion = this.solicitudesForm.get('descripcion')?.value;

    if (!idLaboratorio && (!lugar || lugar.trim() === '')) {
      this.loading = false;
      this.toastr.warning(
        'Debe seleccionar un laboratorio o indicar un lugar.',
        'Atención'
      );
      return;
    }

    if (!descripcion || descripcion.trim() === '') {
      this.loading = false;
      this.toastr.warning(
        'Debe ingresar la descripción de la falla.',
        'Atención'
      );
      return;
    }

    const reporte: ReporteFalla = {
      idUsuario: Number(this.usuarioLogueado.sub),
      lugar: lugar || null,
      descripcion: descripcion,
      estado: 1,
    };

    console.log(reporte);

    this.reporteFallaService.crearReporte(reporte).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success('¡Reporte enviado correctamente!', 'Éxito');
        this.solicitudesForm.reset();
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.toastr.error('Error al enviar el reporte', 'Error');
      },
    });
  }

  obtenerDescripcionLaboratorio(id: number): string {
    const laboratorio = this.laboratorios.find((lab) => lab.id == id);

    return laboratorio?.descripcion.trimStart() || '';
  }
}
