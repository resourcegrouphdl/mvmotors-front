import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-terminos-condiciones',
  standalone: true,
  imports: [ReactiveFormsModule, ],
  templateUrl: './terminos-condiciones.component.html',
  styleUrl: './terminos-condiciones.component.css',
})
export class TerminosCondicionesComponent {

  libroForm: import('@angular/forms').FormGroup;



  constructor(private _fb: FormBuilder) {

    this.libroForm = this._fb.group({

      
      razonSocial: [{ value: 'Mi Empresa SAC', disabled: true }],
      ruc: [{ value: '20512345678', disabled: true }],

      nombreCompleto: ['', Validators.required],
      documento: ['', Validators.required],
      correo: ['', [Validators.email]],
      telefono: [''],
      tipo: ['', Validators.required],
      productoServicio: ['', Validators.required],
      detalle: ['', Validators.required],
      aceptaTerminos: ['', Validators.requiredTrue],

    });

    
  }

  onSubmit() {
    if (this.libroForm.valid) {
      console.log(this.libroForm.value);
    }
  }
}
