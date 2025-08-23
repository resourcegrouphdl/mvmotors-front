import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormserviceService } from '../data-acces/services/formservice.service';
import { Titular } from '../data-acces/titular';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable, Subscriber } from 'rxjs';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-produto-solicitado',
  standalone: true,
  imports: [ NgFor,CommonModule],
  templateUrl: './produto-solicitado.component.html',
  styleUrl: './produto-solicitado.component.css',
})
export class ProdutoSolicitadoComponent  implements OnInit {



  
  data:Titular = {} as Titular;

  constructor( private _datosClietne: FormserviceService, private route: ActivatedRoute ) {}


  ngOnInit(): void {
   
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (id === null) {
            throw new Error('ID parameter is missing');
          }
          return this.obtenerDatosCliente(id);
        })
      )
      .subscribe((data: Titular) => {
        this.data = data;
        console.log(data);
      });
      console.log(this.data);
    
  }


      obtenerDatosCliente(id:string):Observable<any>{
      return this._datosClietne.getById(id);
    }

hasArchivos(): boolean {
    return !!(this.data?.formularioVehiculo?.archivos?.length);
  }

  // Función trackBy para optimizar el rendimiento del *ngFor
  trackByIndex(index: number, item: string): number {
    return index;
  }
  
}
