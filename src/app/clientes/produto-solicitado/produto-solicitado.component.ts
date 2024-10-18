import { Component } from '@angular/core';
import { IModelos, IMotos, MOTOS } from '../data-acces/motos';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { FormserviceService } from '../data-acces/services/formservice.service';
import { Titular } from '../data-acces/titular';

@Component({
  selector: 'app-produto-solicitado',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './produto-solicitado.component.html',
  styleUrl: './produto-solicitado.component.css',
})
export class ProdutoSolicitadoComponent {

  nombre:string = ""; 
  data:Titular = {} as Titular;
  constructor( private _datosClietne: FormserviceService ) {}


  obtenerDatosCliente(id:string){
    this._datosClietne.getById(id);

  }

}
