import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

export interface User {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _fire : Auth) { }

  login(user: User) {
    return signInWithEmailAndPassword(this._fire, user.email, user.password);
  }
}
