import { Component, OnInit } from '@angular/core';
import { LaboratorioService } from '../../../services/Laboratorio/laboratorio.service';
import { Laboratorio } from '../../../interfaces/laboratorio.interface';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-crear-laboratorio',
  imports: [CommonModule,ReactiveFormsModule,MatButtonModule,
    MatFormFieldModule,
    MatInputModule],
  templateUrl: './crear-laboratorio.component.html',
  styleUrl: './crear-laboratorio.component.css'
})
export class CrearLaboratorioComponent implements OnInit {

  solicitudesForm!: FormGroup;
  laboratorios: Laboratorio[] =[];

  constructor(private laboratorioService: LaboratorioService, private fb: FormBuilder,
    private toastr: ToastrService)
    {
       this.solicitudesForm = new FormGroup({
      codigoDeLab: new FormControl('', [Validators.required]),
      capacidad: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      piso: new FormControl('', [Validators.required])
    });

    }




  ngOnInit(): void{
    
    this.laboratorioService.getLaboratorios().subscribe({
      next: (e) => {
        this.laboratorios = e;
      },
      error: () => {
        this.toastr.error('Error al cargar los laboratorios');
      }
    });
  }


   crearLaboratorio(): void {
    if (this.solicitudesForm.invalid) {
      this.toastr.error('Completa todos los campos requeridos');
      return;
    }

    const nuevoLaboratorio: Laboratorio = this.solicitudesForm.value;
   
    this.laboratorioService.agregarLaboratorio(nuevoLaboratorio).subscribe({
      next: () => {
        this.toastr.success('Laboratorio creado exitosamente');
        this.solicitudesForm.reset();
      },
      error: () => {
        this.toastr.error('Error al crear el laboratorio');
      }
    });
  }












}
