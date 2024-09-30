import { Component, OnInit } from '@angular/core';
import { AuthService } from '../data-acces/auth.service';
import { FormGroup, ReactiveFormsModule,FormControl,FormBuilder, Validators } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { User } from '@angular/fire/auth';


@Component({
  selector: 'app-sing-in',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sing-in.component.html',
  styleUrl: './sing-in.component.css'
})
export  class SingInComponent implements OnInit {

   loginForm: FormGroup;

 constructor(private fb: FormBuilder, private authService: AuthService , private _router: Router) {

    this.loginForm = this.fb.group({
      email: ['',(Validators.required, Validators.email)],
      password: ['',(Validators.required, Validators.minLength(6))]
    });

  }
  ngOnInit(): void {
    this.checkIfLoggedIn()
  }

  checkIfLoggedIn(){
    this.authService.isLoggedIn().then((user: User | null) => {
      if (user) {
        console.log(user);
        this._router.navigate(['cliente']);
      } else {
        console.log("No hay usuario logueado");
      }
    }).catch((error:any) => {
      console.log(error);
    });

  }
 

  loguearse(){
    console.log(this.loginForm.value);

    this.authService.login(this.loginForm.value).then(res => {

      if(res){
        console.log(res),
      this._router.navigate(['cliente']),
      toast('Bienvenido'); 
      }
      
      
    }).catch(err => console.log(err)),
    toast('Error al iniciar sesion');
 }

}
