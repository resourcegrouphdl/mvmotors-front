import { inject, Injectable } from '@angular/core';
import { Titular } from '../titular';



 const PATH = 'clientes';


@Injectable({
  providedIn: 'root'
})
export class FormserviceService {



  

 
  constructor() { }

  

  saveFormTiular(cliente:Titular){
    console.log('Form Data:', cliente);

    
  }

  //subir imagen a firebase

  
}
