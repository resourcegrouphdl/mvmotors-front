import { Component } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, MinLengthValidator, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceService } from '../../acces-data-services/auth-service.service';
import { response } from 'express';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

   loginForm:FormGroup;

   constructor(private formBuilder: FormBuilder , private _authService: AuthServiceService, private router: Router) {
      
    this.loginForm = this.formBuilder.group({
      email: [ '',[ Validators.required, Validators.email] ],
      password: [ '', [Validators.required] ]
    });
   }

   onLogin() {

    try {
      
     console.log(this.loginForm.value);
     this._authService.login(this.loginForm.value).then((response) => {
        console.log(response, 'Usuario logueado');
        this.router.navigate(['/configpage']);

     }).catch((error) => {
         console.log(error, 'Error en el formulario');
         alert("error al iniciar sesion,credenciales incorrectas");
       });
     
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    }
  } 


