import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../../../../interfaces/usuarios.interface';
import { UsuarioService } from './usuarios.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-usuarios',
  imports: [MatTableModule,MatSortModule,MatIconModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {



  constructor(private usuarioService: UsuarioService){}

  ngOnInit(): void{
    this.usuarioService.obtenerUsuarios().subscribe(data => {
      this.dataSource.data = data;
    });
  }


  
eliminar(id: number) {
  this.usuarioService.eliminarUsuario(id).subscribe(resultado => {
    if (resultado) {
      this.dataSource.data = this.dataSource.data.filter(u => u.id !== id);
    } else {
      alert('No se pudo eliminar el usuario.');
    }
  });
}



    cambiarRol(usuario: Usuarios) {
    const nuevoRol = prompt('Nuevo rol (Administrador,Estudiante, Super Usuario):', usuario.rol);
    if (nuevoRol === 'Administrador' || nuevoRol === 'Estudiante' || nuevoRol === 'Super Usuario') {
      this.usuarioService.cambiarRol(usuario.id, nuevoRol);
    } else {
      alert('Rol inválido');
    }
  }
  
   displayedColumns: string[] = [  'id','nombre', 'apellido', 'matricula', 'telefono', 'email' , 'direccion','rol', 'acciones'];
   dataSource = new MatTableDataSource<Usuarios>([]);





  

}
