import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../../../../interfaces/usuarios.interface';
import { UsuarioService } from './usuarios.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuarios',
  imports: [MatTableModule,MatSortModule,MatIconModule,MatButtonModule,],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {



  constructor(private usuarioService: UsuarioService, private toastr: ToastrService){}

  ngOnInit(): void{
    this.usuarioService.obtenerUsuarios().subscribe(data => {
      this.dataSource.data = data;
    });
  }


eliminar(id: number) {
  this.usuarioService.eliminarUsuario(id).subscribe(resultado => {
    if (resultado) {
      this.usuarioService.obtenerUsuarios().subscribe(data => {
        this.dataSource.data = data;
        this.toastr.success('El Usuario se a eliminado!', '');
      });
      
    } else {
      alert('No se pudo eliminar el usuario.');
    }
  });
}



    cambiarRol(usuario: Usuarios) {
    const nuevoRol = prompt('Nuevo rol (Administrador,Estudiante, Super Usuario):', usuario.rol);
    if (nuevoRol === 'Administrador' || nuevoRol === 'Estudiante' || nuevoRol === 'Super Usuario') {
      this.usuarioService.cambiarRol(usuario.id, nuevoRol);
      this.toastr.success('Usuario Actualizado!', '')
      
    } else {
      this.toastr.error('Rol incorrecto!', '')
    }
   
  }
  
   displayedColumns: string[] = [  'id','nombre', 'apellido', 'matricula', 'telefono', 'email' , 'direccion','rol', 'acciones'];
   dataSource = new MatTableDataSource<Usuarios>([]);



  

}
