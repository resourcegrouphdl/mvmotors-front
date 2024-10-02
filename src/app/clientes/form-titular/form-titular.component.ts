import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { FormserviceService } from '../data-acces/services/formservice.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-form-titular',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './form-titular.component.html',
  styleUrl: './form-titular.component.css'
})
export class FormTitularComponent {

  formTitular: FormGroup ;
  isInvalidDate: boolean = false;

  constructor(private _fb:FormBuilder , private _formService: FormserviceService, private _router: Router) {

    this.formTitular = this._fb.group({
      nombre: ['',(Validators.required, Validators.minLength(3))],
      documentType: ['',(Validators.required, Validators.minLength(3))],
      documentNumber: ['',(Validators.required, Validators.minLength(3))],
      estadoCivil: ['',(Validators.required, Validators.minLength(3))],
      email: ['',(Validators.required, Validators.email)],
      departamento: ['',(Validators.required, Validators.minLength(3))],
      provincia: ['', (Validators.required, Validators.minLength(3))],
      distrito: ['', (Validators.required, Validators.minLength(3))],
      direccion: ['', (Validators.required, Validators.minLength(3))],
      fechaNacimiento: ['', (Validators.required, Validators.minLength(3))],
      telefono1: ['', (Validators.required, Validators.minLength(3))],
      telefono2: ['', (Validators.required, Validators.minLength(3))],
      licenciaConducir: ['', (Validators.required, Validators.minLength(3))],
      dniFrenteuRL: ['',  (Validators.required, Validators.minLength(3))],
      dniReversoURL: ['', (Validators.required, Validators.minLength(3))],
      reciboDeServicioURL: ['', (Validators.required, Validators.minLength(3))],
      licConducirFrenteURL: ['', (Validators.required, Validators.minLength(3))],
      licConducirReversoURL: ['', (Validators.required, Validators.minLength(3))],
      fotoCasaURL: ['', (Validators.required, Validators.minLength(3))],
      serlfieURL: ['', (Validators.required, Validators.minLength(3))],
    });
   }


   saveSectionOne(){
    console.log('Form Data:', this.formTitular.value);
    // Aquí puedes manejar el envío del formulario

    this._formService.saveFormTiular(this.formTitular.value);
    this._router.navigate(['cliente/clientes']);
    
    toast('datos guardados');
    }

    consultarDniApi(){
      toast('Consultando API');
      
    }

    dateValidator(control: any) {
      const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
      return regex.test(control.value) ? null : { invalidDate: true };
    }
  
    validateDate() {
      const control = this.formTitular.get('fechaNacimiento');
      if (control && control.value) {
        this.isInvalidDate = !this.dateValidator(control);
      }
    }
}