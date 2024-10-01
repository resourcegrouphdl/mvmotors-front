import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [NgIf],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css'
})
export class FormularioComponent {

  currentSection: number = 1;

  formData: any = {
    firstName: '',
    lastName: '',
    estadoCivil: '',
    fiadorName: '',
    productoName: ''
  };


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
    console.log('Form Data:', this.formData);
    // Aquí puedes manejar el envío del formulario
  }
}
