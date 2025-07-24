import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../../acces-data-services/auth-service.service';
import { FormBuilder, ReactiveFormsModule, Validators, FormControl, FormGroup,FormControlName } from '@angular/forms';
import { Router } from '@angular/router';
import { SesseionStorageService } from '../../acces-data-services/sesseion-storage.service';

@Component({
  selector: 'app-quienes-somos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './quienes-somos.component.html',
  styleUrl: './quienes-somos.component.css'
})
export class QuienesSomosComponent {

  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  authService = inject(AuthServiceService);
  fb = inject(FormBuilder);
  router = inject(Router); 



  sessionService = inject(SesseionStorageService);

  logoPath: string = 'https://www.motoya.com.pe/wp-content/uploads/2023/07/Logo-web.png'; // Path to your logo image

  uid: string  = "";
  isLogin: boolean = false; // Toggle between login and register
  showPassword: boolean = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
 
  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    try {
      const result = await this.authService.login(email, password);

      if (result.success) {
        if (result.requiresPasswordChange) {
          // Redirigir a cambio de contraseña
          this.router.navigate(['quienes-somos/change-password']);
        }
        // Si no requiere cambio, el AuthService ya manejó la redirección
      } else {
        this.errorMessage = result.error || 'Error desconocido';
      }
    } catch (error) {
      console.error('Error en login:', error);
      this.errorMessage = 'Error inesperado. Intenta nuevamente.';
    } finally {
      this.isLoading = false;
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}
  