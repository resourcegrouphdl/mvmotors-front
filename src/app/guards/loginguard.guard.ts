import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthServiceService } from '../acces-data-services/auth-service.service';
import { map, take } from 'rxjs';

export const loginguardGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  const authService = inject(AuthServiceService);
  const router = inject(Router);

  
  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/login']);
        return false;
      }

      const currentUser = authService.getCurrentUser();
      
      // Si el usuario necesita cambiar contraseña y no está en la página de cambio
      if (currentUser?.isFirstLogin && !state.url.includes('/change-password')) {
        router.navigate(['/change-password']);
        return false;
      }

      // Si ya cambió contraseña pero está tratando de acceder a change-password
      if (!currentUser?.isFirstLogin && state.url.includes('/change-password')) {
        // Redirigir según tipo de usuario
        redirectUserByType(currentUser?.userType, router);
        return false;
      }

      return true;
    })
  );
}

  // role.guard.ts - Guard funcional para verificar roles específicos
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (!user) {
        router.navigate(['/login']);
        return false;
      }

      // Verificar si necesita cambiar contraseña primero
      if (user.isFirstLogin) {
        router.navigate(['/change-password']);
        return false;
      }

      // Obtener roles permitidos desde la configuración de la ruta
      const allowedRoles = route.data?.['allowedRoles'] as string[];
      
      if (allowedRoles && !allowedRoles.includes(user.userType)) {
        // Usuario no tiene permiso, redirigir a su dashboard correspondiente
        redirectUserByType(user.userType, router);
        return false;
      }

      return true;
    })
  );
};

// Función helper para redirigir según tipo de usuario
function redirectUserByType(userType: any, router: Router): void {
  switch (userType) {
    case 'store':
      router.navigate(['/dashboard/store']);
      break;
    case 'vendor':
      router.navigate(['/dashboard/vendor']);
      break;
    default:
      router.navigate(['/dashboard']);
  }
}

// login.guard.ts - Guard adicional para proteger la página de login
export const loginGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        const currentUser = authService.getCurrentUser();
        
        // Si está autenticado pero necesita cambiar contraseña
        if (currentUser?.isFirstLogin) {
          router.navigate(['/change-password']);
          return false;
        }
        
        // Si ya está autenticado y no necesita cambiar contraseña, redirigir al dashboard
        redirectUserByType(currentUser?.userType, router);
        return false;
      }
      
      // Si no está autenticado, permitir acceso a login
      return true;
    })
  );
};

// anonymous.guard.ts - Guard para rutas que solo pueden acceder usuarios no autenticados
export const anonymousGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        const currentUser = authService.getCurrentUser();
        
        // Si está autenticado, redirigir según su estado
        if (currentUser?.isFirstLogin) {
          router.navigate(['/change-password']);
        } else {
          redirectUserByType(currentUser?.userType, router);
        }
        return false;
      }
      
      return true;
    })
  );
};

// first-login.guard.ts - Guard específico para la página de cambio de contraseña
export const firstLoginGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/login']);
        return false;
      }

      const currentUser = authService.getCurrentUser();
      
      // Solo permitir acceso si es primer login
      if (!currentUser?.isFirstLogin) {
        redirectUserByType(currentUser?.userType, router);
        return false;
      }

      return true;
    })
  );
};
