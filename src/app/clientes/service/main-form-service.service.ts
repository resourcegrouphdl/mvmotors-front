import { inject, Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class MainFormServiceService {


  formCliente: FormGroup;

  

  constructor(private _fb: FormBuilder) {

    this.formCliente = this.initForm();

  }

  initForm(): FormGroup {
    return this._fb.group({
      //formulario del titular

      formTitular: this._fb.group({
        
      }),

      //formulario del fiador

      formFiador: this._fb.group({
        campoC: [''],
        campoD: [''],
      }),

      //formulario complementario
      formComplementario: this._fb.group({
        campoE: [''],
        campoF: [''],
      }),
    });
  }

  // metodo para obtener el formulario
  getForm() {
    return this.formCliente;
  }

  // Método para guardar los datos en cualquier momento
  saveFormData(data: any) {
    if (this.formCliente) {
      this.formCliente.patchValue(data);
    }
  }
}
