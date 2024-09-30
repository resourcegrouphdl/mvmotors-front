import { inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivateFn, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export const authGuardGuard: CanActivateFn = (route, state) : Observable<boolean>=> {
 
  const afAuth = inject(AngularFireAuth); // Inyecta el servicio de autenticación
  const router = inject(Router); // Inyecta el enrutador para redirigir si es necesario
  
  return afAuth.authState.pipe(
    map(user => {
      if (!user) {
        router.navigate(['/login']);
        return false;
      } 
      return true;
    })
  );

};


export const publicGuard: CanActivateFn = (route, state) => {
  return true;
};