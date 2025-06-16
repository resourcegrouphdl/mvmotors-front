import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword ,User} from '@angular/fire/auth';
import { UserloginModel } from '../models/userlogin-model';
import { BehaviorSubject } from 'rxjs';
import { collection, doc, Firestore, getDoc } from '@angular/fire/firestore';
import { environment } from './envinments';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

   private _firestore = inject(Firestore);


    private _tiendaCollection = collection(this._firestore, environment.PATH_TABLE_TIENDAS);

  userCredentials: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  // Observable to track user credentials

  constructor(private _fire : Auth) { }


  login(userdto: UserloginModel) {
    return signInWithEmailAndPassword(this._fire, userdto.email, userdto.password);

  }

  isLoggedIn(): Promise<User|null> {
    return new Promise((resolve, reject) => {
      this._fire.onAuthStateChanged((user:User|null) => {
        if (user) {
          resolve(user);
        } else {
          reject('No hay usuario logueado');
        }
      });
    });

  }

 

  

  logout() {
    return this._fire.signOut();
  }

  getUserCredentials(): BehaviorSubject<User | null> {
    return this.userCredentials;
  }
  setUserCredentials(user: User | null) {
    this.userCredentials.next(user);
  }
  updateUserCredentials(user: User | null) {
    this.userCredentials.next(user);
  }
 
  
  getuserById(id:string) : Promise<UserRole> {
    return new Promise((resolve, reject) => {
      const userRef = doc(this._firestore, `${environment.PATH_TABLE_TIENDAS}/${id}`);
      getDoc(userRef).then((doc) => {
        if (doc.exists()) {
          resolve(doc.data() as UserRole);
        } else {
          reject('No se encontró el usuario');
        }
      }).catch((error) => {
        reject('Error al obtener el usuario: ' + error);
      });
    });
  }

}

export interface UserRole {

  id?: string;
  correo: string;
  direccion: string;
  imagen: string;
  preciosPorTienda?: listaDePrecios[];
  rolesId: string;
  razonSocial: string;
  telefono: string;
}
 export interface listaDePrecios {
  marca: string;
  modelo: string;
  precio: string;
  stock: string;
 }