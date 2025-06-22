import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, collectionData, doc, Firestore, getDoc, orderBy, query, serverTimestamp, setDoc, Timestamp } from '@angular/fire/firestore';
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

 sendMessage(uid_usuario: string, contenido: string): Promise<void> {
  const chatId = this.getChatId(uid_usuario);
  const chatRef = doc(this._firestore, `chats/${chatId}`);
  const mensajesRef = collection(this._firestore, `chats/${chatId}/mensajes`);

  const remitenteID = this._auth.currentUser?.uid;
  if (!remitenteID) return Promise.reject('Usuario no autenticado');

  const mensaje = {
    remitenteID,
    contenido,
    timestamp: serverTimestamp(),
    leido: false
  };

  return getDoc(chatRef).then(chatSnap => {
    if (!chatSnap.exists()) {
      // Crear el chat con los participantes
      return setDoc(chatRef, {
        participantes: [remitenteID, uid_usuario]
      });
    }
    return;
  }).then(() => {
    // Agregar el mensaje a la subcolección
    return addDoc(mensajesRef, mensaje);
  }).then(() => {
    // Garantiza que la promesa devuelva void
    return;
  });
}

  listenToMessages(uidUsuario: string): Observable<any[]> {
    const chatId = this.getChatId(uidUsuario);
    const mensajesRef = collection(this._firestore, `chats/${chatId}/mensajes`);
    const mensajesQuery = query(mensajesRef, orderBy('timestamp'));

    return collectionData(mensajesQuery, { idField: 'id' });
  }



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