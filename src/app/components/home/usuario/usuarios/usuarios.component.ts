import { Component, inject, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Usuarios } from '../../../../interfaces/usuarios.interface';
import { UsuarioService } from './usuarios.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UsuarioDialogComponent } from './usuario-dialog/usuario-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { PreguntaDialogComponent } from '../../../elements/pregunta-dialog/pregunta-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { take } from 'rxjs';


@Component({
  selector: 'app-usuarios',
  imports: [MatTableModule,
            MatSortModule,
            MatIconModule,
            MatButtonModule,
            MatFormFieldModule,
            MatSelectModule,
            MatButtonModule,
            MatDialogModule,
            MatInputModule,
            MatPaginatorModule,
            MatTooltipModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {

  displayedColumns: string[] = [  'id','nombre', 'apellido', 'matricula', 'telefono', 'email' , 'direccion','rol','acciones'];
  dataSource = new MatTableDataSource<Usuarios>([]);
  

  constructor(private usuarioService: UsuarioService, private toastr: ToastrService, private _dialog: MatDialog){}

  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined; 

  ngOnInit(): void{
    this.usuarioService.obtenerUsuarios().subscribe(data => {
      this.dataSource.data = data.datos;
      this.dataSource = new MatTableDataSource(data.datos);
      this.dataSource.paginator = this.paginator!;
      this.dataSource.sort = this.sort!;
      console.log(data)

       this.dataSource.filterPredicate = (usuario, filter: string) => {
      const dataStr = (
        usuario.nombreUsuario +
        ' ' + usuario.apellidoUsuario +
        ' ' + usuario.idMatricula 
      ).toLowerCase();
      return dataStr.includes(filter);
    };
    });
  }


eliminar(id: string) {

const dialogRef = this._dialog.open(PreguntaDialogComponent, {
      data: {
        titulo: '¿Seguro?',
        mensaje:
          '¿Quieres eliminar el usuario de forma PERMANENTE?',
      },
    });

  dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
    if(result){
       this.usuarioService.eliminarUsuario(id).subscribe({
    next: () => {
      this.toastr.success('Usuario eliminado correctamente');
      this.ngOnInit();
    },
    error: (err) => {
      console.error('Error al eliminar usuario:', err);
    }
  });
    }else{this.toastr.info('No se pudo eliminar el usuario.');}
  })
}

  cambiarRol(usuario: Usuarios) {
  const nuevoRol = prompt('Ingrese el nuevo rol (Estudiante, Administrador, Super Usuario):', usuario.idrol);
  const rolesValidos: Usuarios['idrol'][] = ['Estudiante', 'Administrador', 'Super Usuario'];

  if (nuevoRol && rolesValidos.includes(nuevoRol as Usuarios['idrol'])) {
    this.usuarioService.cambiarRol(usuario.id, nuevoRol as Usuarios['idrol']).subscribe({
      next: () => {
        this.toastr.success('Rol actualizado correctamente.');
        this.ngOnInit();
      },
      error: () => {
        this.toastr.error('Error al actualizar el rol.');
      }
    });
  } else if (nuevoRol) {
    this.toastr.warning('Rol inválido.');
  }
}


  desactivarUsuario(usuario: Usuarios): void{
    const dialogRef = this._dialog.open(PreguntaDialogComponent, {
      data: {
        titulo: '¿Seguro?',
        mensaje:
          '¿Quieres desactivar el usuario?',
      },
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
      if(result){
         const nuevoEstado = !usuario.activado;
         this.usuarioService.desactivarUsuario(usuario.id, nuevoEstado).subscribe({
      next: () => {
        usuario.activado = nuevoEstado;
        this.toastr.success(
          `Usuario ${nuevoEstado ? 'activado' : 'dasactivado'} correctamente.`
        );
      },
      error: (err) => {
        console.error(err);
        this.toastr.info('Se  desactivo  el usuario')
      }
    })
      }else{
        this.toastr.info('No se  cambio el estado del usuario')
      }
    })
   
  }

  applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}



 //otra vista 

 readonly dialog = inject(MatDialog);

 openDialog(usuario: Usuarios) {
  const dialogRef = this.dialog.open(UsuarioDialogComponent, {
    width: '400px',
    data: usuario
  });

  dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
    if (result) {
      this.usuarioService.obtenerUsuarios().subscribe(data => {
        this.dataSource.data = data.datos;
        this.dataSource.paginator = this.paginator!;
        this.dataSource.sort = this.sort!;
        this.toastr.success('Tabla actualizada tras edición');
      });
    }
  });
}





}
