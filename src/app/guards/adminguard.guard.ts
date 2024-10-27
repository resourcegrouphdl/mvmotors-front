import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';
import { log } from 'console';
import { toast } from 'ngx-sonner';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

export const adminguardGuard: CanActivateFn = (route, state) => {
  const afAuth = inject(Auth);
  const router = inject(Router);

  return new Observable<boolean>((observer: { next: (arg0: boolean) => void; complete: () => void; }) => {
    afAuth.onAuthStateChanged((user) => {
      observer.next(!!user);
      observer.complete();
    });
  }).pipe(
    take(1),
    tap((loggedIn) => {
      if (!loggedIn) {
        router.navigate(['/admin']);
      }
    })
  );
};
