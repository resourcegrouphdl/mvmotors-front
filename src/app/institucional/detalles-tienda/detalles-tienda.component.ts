import { Component, inject, OnInit } from '@angular/core';
import { SesseionStorageService } from '../../acces-data-services/sesseion-storage.service';
import { UserRole } from '../../acces-data-services/auth-service.service';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { ChatService, Mensaje } from '../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-detalles-tienda',
  standalone: true,
  imports: [NgClass, FormsModule, NgFor, NgIf, CommonModule],
  templateUrl: './detalles-tienda.component.html',
  styleUrl: './detalles-tienda.component.css'
})
export class DetallesTiendaComponent implements OnInit {

   _storageService = inject(SesseionStorageService);
   _chatService = inject(ChatService);

    isVisible = false;
     messages: { text: string; sender: 'user' | 'admin' }[] = []; // puedes usar esto si quieres mostrar mensajes
     newMessage: string = ''; // vínculo con el input
     mensajes: Mensaje[] = [];
     uidFirebase: string = '';
     uidUsuario: string = 'Fd3TYGfD4dXVBipaPU06qe78mCP2';
     usuarioActivo: String = '';


   datosDeLaTienda:UserRole = {} as UserRole; 

  ngOnInit(): void {
    this.datosDeLaTienda = this.getDataTienda();

    if (!this.datosDeLaTienda || !this.datosDeLaTienda.uidFirebase) {
      console.error('Datos de la tienda no disponibles o UID no encontrado');
    } else {
      this.uidFirebase = this.datosDeLaTienda.uidFirebase;
      this.usuarioActivo = this.obtenerIniciales(this.datosDeLaTienda.razonSocial);
      this.listenToMessages(); // Inicia la escucha de mensajes
      
    }
    
  }

 
   toggleChat(): void {
    this.isVisible = !this.isVisible;
  }


  getDataTienda() {
    return this._storageService.getUsuarioActual();
  }

  sendMessage(): void {
  const contenido = this.newMessage.trim();

  if (!contenido) return; // evita enviar mensajes vacíos

  if (this.datosDeLaTienda && this.datosDeLaTienda.uidFirebase) {
    this._chatService.sendMessage(this.datosDeLaTienda.uidFirebase, contenido)
      .then(() => {
        console.log('Mensaje enviado correctamente');
        this.newMessage = ''; // limpia el input
        // Opcional: agregar el mensaje a un array de mensajes si lo estás mostrando en pantalla
        // this.messages.push({ text: contenido, sender: 'user' });
      })
      .catch(error => {
        console.error('Error al enviar el mensaje:', error);
      });
  } else {
    console.error('Datos de la tienda no disponibles o UID no encontrado');
  }
}

  listenToMessages(): void {
  if (this.datosDeLaTienda && this.datosDeLaTienda.uidFirebase) {
    this._chatService.listenToMessages(this.datosDeLaTienda.uidFirebase)
      .subscribe(messages => {
        console.log('Mensajes recibidos:', messages);
        this.mensajes = messages;
      }, error => {
        console.error('Error al escuchar mensajes:', error);
      });
  } else {
    console.error('Datos de la tienda no disponibles o UID no encontrado');
  }
}

 obtenerIniciales(nombre: string): string {
    return this.datosDeLaTienda.razonSocial.substring(0, 2).toUpperCase() || 'US';
  }

  

}
