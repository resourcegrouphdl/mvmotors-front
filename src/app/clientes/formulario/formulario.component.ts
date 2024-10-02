import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder,FormGroup, Validators } from '@angular/forms';
import { FormTitularComponent } from '../form-titular/form-titular.component';
import { FormFiadorComponent } from '../form-fiador/form-fiador.component';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule,FormTitularComponent,FormFiadorComponent],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css'
})
export class FormularioComponent {

  currentSection: number = 1;

 

  


  nextSection() {
    if (this.currentSection < 3) {
      this.currentSection++;
    }
  }

  prevSection() {
    if (this.currentSection > 1) {
      this.currentSection--;
    }
  }

  onSubmit() {
    console.log('Form Data:');
    // Aquí puedes manejar el envío del formulario
  }

  

}
