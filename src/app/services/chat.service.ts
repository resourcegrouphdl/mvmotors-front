import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, collectionData, Firestore, orderBy, query, Timestamp } from '@angular/fire/firestore';
import { Observable, timestamp } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  _firestore = inject(Firestore);
  _auth = inject(Auth);

  
  constructor() { }


  getChatId(uid_usuario:string):string {
    return uid_usuario;
  }

  sendMessage(uid_usuario: string, contenido: string): Promise <void> {
     const chatId =this.getChatId(uid_usuario);
     const mensajesRef = collection(this._firestore, `chats/${chatId}/mensajes`);

     const mensaje = {
      renitenteID: this._auth.currentUser?.uid,
      contenido,
      timestamp: Timestamp.now(),
      leido: false

     };
     return addDoc(mensajesRef, mensaje).then(() => {});
  }

  listenToMessages(uidUsuario: string): Observable<any[]> {
    const chatId = this.getChatId(uidUsuario);
    const mensajesRef = collection(this._firestore, `chats/${chatId}/mensajes`);
    const mensajesQuery = query(mensajesRef, orderBy('timestamp'));

    return collectionData(mensajesQuery, { idField: 'id' });
  }


  //------ obtener lista de contactos del chat------

  
  

}



export interface Mensaje {
  id?: string; // opcional, se asigna al obtener datos de Firestore
  remitenteId: string; // UID del que envía el mensaje
  contenido: string;
  timestamp: any; // puede ser `Timestamp` de Firestore
  leido: boolean;
}

export interface Usuario {
  uid: string;
  nombre: string;
  email: string;
  fotoUrl?: string;
  // Otros campos personalizados
}
export interface Chat {
  id?: string; // ID del documento del chat, puede ser igual al UID del usuario
  participantes: string[]; // [uid_admin, uid_usuario]
}