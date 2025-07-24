import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../acces-data-services/auth-service.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

   constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router
  ) {
    this.changePasswordForm = this.fb.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Verificar que el usuario esté autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Verificar que efectivamente necesite cambiar contraseña
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && !currentUser.isFirstLogin) {
      // Ya cambió la contraseña, redirigir según tipo
      this.redirectUserByType(currentUser.userType);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.changePasswordForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { newPassword } = this.changePasswordForm.value;

    try {
      const result = await this.authService.changePassword(newPassword);

      if (result.success) {
        this.successMessage = 'Contraseña cambiada exitosamente. Redirigiendo...';
        // La redirección ya se maneja en el AuthService
      } else {
        this.errorMessage = result.error || 'Error al cambiar contraseña';
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      this.errorMessage = 'Error inesperado. Intenta nuevamente.';
    } finally {
      this.isLoading = false;
    }
  }
  getPasswordRequirementClass(requirement: string): string {
    const password = this.changePasswordForm.get('newPassword')?.value || '';
    let isValid = false;

    switch (requirement) {
      case 'length':
        isValid = password.length >= 8;
        break;
      case 'upper':
        isValid = /[A-Z]/.test(password);
        break;
      case 'lower':
        isValid = /[a-z]/.test(password);
        break;
      case 'number':
        isValid = /[0-9]/.test(password);
        break;
      case 'special':
        isValid = /[#?!@$%^&*-]/.test(password);
        break;
    }

    return isValid ? 'text-green-600' : 'text-gray-500';
  }

   private markFormGroupTouched(): void {
    Object.keys(this.changePasswordForm.controls).forEach(key => {
      const control = this.changePasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  private redirectUserByType(userType: any): void {
    switch (userType) {
      case 'store':
        this.router.navigate(['/dashboard/store']);
        break;
      case 'vendor':
        this.router.navigate(['/dashboard/vendor']);
        break;
      default:
        this.router.navigate(['/dashboard']);
    }
  }


}
