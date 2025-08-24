import { inject, Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, signInWithEmailAndPassword ,updatePassword,User} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { doc, Firestore, getDoc, updateDoc } from '@angular/fire/firestore';
import { BaseUser, StoreUser, UserType, VendorUser } from '../models/model-auth';
import { Router } from '@angular/router';
import { environment } from './envinments';



@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private userTableName = environment.PATH_FIREBASE_USERS || 'users';

  private currentUserSubject = new BehaviorSubject<BaseUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();


  
  constructor() { 
    
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        await this.loadUserProfile(firebaseUser.uid);
      } else {
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
      }
    });
  }

  


  async login(email: string, password: string): Promise<{ success: boolean; requiresPasswordChange?: boolean; error?: string }> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      // Cargar perfil del usuario
      const userProfile = await this.getUserProfile(user.uid);
      
      if (!userProfile) {
        throw new Error('Perfil de usuario no encontrado');
      }

      if (!userProfile.isActive) {
        throw new Error('Usuario inactivo');
      }

      // Verificar si es primer login
      if (userProfile.isFirstLogin) {
        return { 
          success: true, 
          requiresPasswordChange: true 
        };
      }

      // Login exitoso, dirigir según tipo de usuario
      this.redirectUserByType(userProfile.userType);
      
      return { success: true };

    } catch (error: any) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        error: this.getAuthErrorMessage(error.code) 
      };
    }
  }
 
async changePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const currentFirebaseUser = this.auth.currentUser;
      if (!currentFirebaseUser) {
        throw new Error('Usuario no autenticado');
      }

      // Cambiar contraseña en Firebase Auth
      await updatePassword(currentFirebaseUser, newPassword);

      // Actualizar flags en Firestore
      const userDocRef = doc(this.firestore, 'users', currentFirebaseUser.uid);
      await updateDoc(userDocRef, {
        isFirstLogin: false,
        lastPasswordChange: new Date(),
        updatedAt: new Date()
      });

      // Recargar perfil de usuario
      await this.loadUserProfile(currentFirebaseUser.uid);

      // Dirigir según tipo de usuario
      const currentUser = this.currentUserSubject.value;
      console.log('Usuario actual después de cambiar contraseña:', currentUser);
      if (currentUser) {
        this.redirectUserByType(currentUser.userType);
      }

      return { success: true };

    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      return { 
        success: false, 
        error: this.getAuthErrorMessage(error.code) 
      };
    }
  }
  

  private async loadUserProfile(uid: string): Promise<void> {
    try {
      const userProfile = await this.getUserProfile(uid);
      if (userProfile) {
        this.currentUserSubject.next(userProfile);
        this.isAuthenticatedSubject.next(true);
      }
    } catch (error) {
      console.error('Error cargando perfil:', error);
      this.currentUserSubject.next(null);
      this.isAuthenticatedSubject.next(false);
    }
  }

  private async getUserProfile(uid: string): Promise<BaseUser | null> {
    try {
      const userDocRef = doc(this.firestore, this.userTableName, uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        return null;
      }

      const userData = userDoc.data() as BaseUser;
      
      // Crear instancia específica según tipo de usuario
      if (userData.userType === UserType.STORE) {
        
        return Object.assign(new StoreUser(), userData);
      } else if (userData.userType === UserType.VENDOR) {
        
        return Object.assign(new VendorUser(), userData);
      }
      
      return userData;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      return null;
    }
  }

  private redirectUserByType(userType: UserType): void {
    switch (userType) {
      case UserType.STORE:
        this.router.navigate(['/quienes-somos/store']);
        break;
      case UserType.VENDOR:
        this.router.navigate(['/quienes-somos/vendor']);
        break;
      default:
        this.router.navigate(['/quienes-somos']);
    }
  }

  private getAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/user-disabled':
        return 'Usuario deshabilitado';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Intenta más tarde';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres';
      default:
        return 'Error de autenticación';
    }
  }

  async logout(): Promise<void> {
    try {
      await this.auth.signOut();
      this.currentUserSubject.next(null);
      this.isAuthenticatedSubject.next(false);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error en logout:', error);
    }
  }

  getCurrentUser(): BaseUser | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
 }