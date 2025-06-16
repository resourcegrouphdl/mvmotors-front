import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AuthServiceService } from '../../acces-data-services/auth-service.service';
import { FormBuilder, ReactiveFormsModule, Validators, FormControl, FormGroup,FormControlName } from '@angular/forms';
import { Router } from '@angular/router';
import { SesseionStorageService } from '../../acces-data-services/sesseion-storage.service';

@Component({
  selector: 'app-quienes-somos',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './quienes-somos.component.html',
  styleUrl: './quienes-somos.component.css'
})
export class QuienesSomosComponent {
  _sesseionService = inject(SesseionStorageService);

  _authServices = inject(AuthServiceService);
  _fb = inject(FormBuilder);
  _router = inject(Router); 
  loginForm: FormGroup;
  uid: string  = "";


  constructor() {
    this.loginForm = this._fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }
 
  async login() {
   await this._authServices.login(this.loginForm.value)
      .then((userCredential) => {
        // Login successful
        console.log('Login successful:', userCredential);
        this.uid = userCredential.user.uid; // Get the user ID
        this.obtenerUsuarioActual(); // Call to get current user data
        this._sesseionService.getUsuarioActual();
        const roleIS = this._sesseionService.rolDeTipo();
       console.log("Role IS: ", roleIS);
        if (roleIS === "tienda") {
          this._router.navigate(['/quienes-somos/tienda']);
        } else if (roleIS === "aliado") {
          this._router.navigate(['/quienes-somos/aliado']);
        } else {
          this._router.navigate(['/quienes-somos/login']);
        }
      })
      .catch((error) => {
        // Handle login error
        console.error('Login error:', error);
      });
  }

  obtenerUsuarioActual(){
    this._authServices.getuserById(this.uid).then(
      (user) => {
        // User data retrieved successfully
        this._sesseionService.setUsuarioActual(user);
        
      }
    ).catch((error) => {
      // Handle error
      console.error('Error retrieving user data:', error);
    });
  }

}
  