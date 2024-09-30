import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword ,User} from '@angular/fire/auth';

export interface Userdto {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _fire : Auth) { }

  login(userdto: Userdto) {
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
  

}
