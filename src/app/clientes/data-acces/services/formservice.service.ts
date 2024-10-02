import { inject, Injectable } from '@angular/core';
import { Titular } from '../titular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';


 const PATH = 'clientes';

@Injectable({
  providedIn: 'root'
})
export class FormserviceService {

  private _firestore = inject(Firestore)

  private _collection = collection(this._firestore, PATH);

  

  

  saveFormTiular(cliente:Titular){
    console.log('Form Data:', cliente);

    return addDoc(this._collection, cliente);
  
  }

}
