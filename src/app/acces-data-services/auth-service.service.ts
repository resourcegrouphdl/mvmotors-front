import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword ,User} from '@angular/fire/auth';
import { UserloginModel } from '../models/userlogin-model';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

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

  logaut() {
    return this._fire.signOut();
  }

}
