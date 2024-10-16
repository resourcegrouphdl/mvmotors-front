import { Component } from '@angular/core';
import { IModelos, IMotos, MOTOS } from '../data-acces/motos';
import { FormBuilder, FormGroup ,ReactiveFormsModule} from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-produto-solicitado',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './produto-solicitado.component.html',
  styleUrl: './produto-solicitado.component.css'
})
export class ProdutoSolicitadoComponent {


  motocicletaMarcas: IMotos[] = MOTOS;
  motocicletaModelos: IModelos[] = [];
  motocicletaColores: string[] = [];

  selectMarca: string = '';
  selectMdodelo: string = '';
  selectColor: string = '';

  form: FormGroup;


  constructor(private _fb: FormBuilder) {
    this.form = this._fb.group({
      marca: [''],
      modelo: [''],
      color: ['']
    });
  }


  onMarcaChange(modelo: string) {
    this.selectMdodelo = modelo;
    this.motocicletaModelos = this.motocicletaMarcas.find(marca => marca.marca === modelo)?.modelo || [];
    this.motocicletaColores = [];
    this.selectMdodelo = '';

    }

    onModeloSelect(selectMdodelo: string) {
      this.selectMdodelo = selectMdodelo;
      this.motocicletaColores = this.motocicletaModelos.find(modelo => modelo.modelo === selectMdodelo)?.color || [];
      this.selectColor = '';


    }
}
