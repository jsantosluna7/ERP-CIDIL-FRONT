import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuarios } from '../../../../interfaces/usuarios.interface';
import { UsuarioService } from './usuarios.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-usuarios',
  imports: [MatTableModule,MatSortModule,MatIconModule,MatButtonModule,MatFormFieldModule, MatSelectModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {

  displayedColumns: string[] = [  'id','nombre', 'apellido', 'matricula', 'telefono', 'email' , 'direccion','rol', 'acciones'];
  dataSource = new MatTableDataSource<Usuarios>([]);

  constructor(private usuarioService: UsuarioService, private toastr: ToastrService){}

  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined; 

  ngOnInit(): void{
    this.usuarioService.obtenerUsuarios().subscribe(data => {
      this.dataSource.data = data.datos;
      console.log(data)
    });
  }


/*eliminar(id: number) {
  this.usuarioService.eliminarUsuario(id).subscribe((resultado: void) => {
    if (resultado) {
      this.usuarioService.obtenerUsuarios().subscribe(data => {
        this.dataSource.data = data;
        this.toastr.success('El Usuario se a eliminado!', '');
      });
      
    } else {
      alert('No se pudo eliminar el usuario.');
    }
  });
}*/


eliminar(id: string) {
  this.usuarioService.eliminarUsuario(id).subscribe({
    next: () => {
      this.toastr.success('Usuario eliminado correctamente');
      this.ngOnInit();
    },
    error: (err) => {
      console.error('Error al eliminar usuario:', err);
      this.toastr.error('No se pudo eliminar el usuario.');
    }
  });
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


   /* cambiarRol(usuario: Usuarios) {
    const nuevoRol = prompt('Nuevo rol (Administrador,Estudiante, Super Usuario):', usuario.rol);
    if (nuevoRol === 'Administrador' || nuevoRol === 'Estudiante' || nuevoRol === 'Super Usuario') {
      this.usuarioService.cambiarRol(usuario.id, nuevoRol);
      this.toastr.success('Usuario Actualizado!', '')
      
    } else {
      this.toastr.error('Rol incorrecto!', '')
    }
   
  }*/
  
   



  

}
