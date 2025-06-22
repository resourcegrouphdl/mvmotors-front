import { Injectable } from '@angular/core';
import { UserRole } from './auth-service.service';
import { Observable } from 'rxjs';
import { Mensaje } from '../services/chat.service';

@Injectable({
  providedIn: 'root'
})
export class SesseionStorageService {

  usuarioActual: UserRole = {} as UserRole;
 

  setUsuarioActual(usuario: UserRole) {
    this.usuarioActual = usuario;
    sessionStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getUsuarioActual(): UserRole {
    const usuario = sessionStorage.getItem('usuario');
    if (usuario) {
      this.usuarioActual = JSON.parse(usuario);
      console.log(this.usuarioActual);
    }
    return this.usuarioActual;
  
  }

  clearUsuarioActual() {
    this.usuarioActual = {} as UserRole;
    sessionStorage.removeItem('usuario');
  }

  // Método para verificar si el usuario tiene un rol específico
  hasRole(role: string): boolean {
    const usuario = this.getUsuarioActual();
    return usuario && usuario.rolesId ? usuario.rolesId.includes(role) : false;
  }

  rolDeTipo(){
    return this.usuarioActual.rolesId ;
  }

  constructor() { }
}
