import { Component } from '@angular/core';
import { FormserviceService } from '../data-acces/services/formservice.service';
import { Router } from '@angular/router';
import { FormBuilder , ReactiveFormsModule , FormControlName, Validators, FormGroup} from '@angular/forms';
import { toast } from 'ngx-sonner';


@Component({
  selector: 'app-form-fiador',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-fiador.component.html',
  styleUrl: './form-fiador.component.css'
})
export class FormFiadorComponent {

  formFiador: FormGroup ;


  constructor(private _fb:FormBuilder , private _formService: FormserviceService, private _router: Router) {

    this.formFiador = this._fb.group({
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
    console.log('Form Data:', this.formFiador.value);
    // Aquí puedes manejar el envío del formulario

    this._formService.saveFormTiular(this.formFiador.value);
    this._router.navigate(['cliente/clientes']);
    
    toast('datos guardados');
    }

    consultarDniApi(){
      toast('Consultando API');
      
    }

}
