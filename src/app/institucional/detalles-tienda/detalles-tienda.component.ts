import { Component, inject, OnInit } from '@angular/core';
import { SesseionStorageService } from '../../acces-data-services/sesseion-storage.service';
import { UserRole } from '../../acces-data-services/auth-service.service';

@Component({
  selector: 'app-detalles-tienda',
  standalone: true,
  imports: [],
  templateUrl: './detalles-tienda.component.html',
  styleUrl: './detalles-tienda.component.css'
})
export class DetallesTiendaComponent implements OnInit {

   _storageService = inject(SesseionStorageService);

   datosDeLaTienda:UserRole = {} as UserRole; 

  ngOnInit(): void {
    this.datosDeLaTienda = this.getDataTienda();
    
  }

 



  getDataTienda() {
    return this._storageService.getUsuarioActual();
  }

  

}
