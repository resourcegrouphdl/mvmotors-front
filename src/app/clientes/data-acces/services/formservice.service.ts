import { inject, Injectable } from '@angular/core';
import { Titular } from '../titular';
import { collection, Firestore, addDoc, doc, updateDoc, docData } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { Storage,  } from "@angular/fire/storage";


 const PATH = 'clientes';


@Injectable({
  providedIn: 'root'
})
export class FormserviceService {

  private _firestore = inject(Firestore);

  private _collection = collection( this._firestore,PATH);


  isUploading = false;
  isUploaded = false;
  uploadProgress: Observable<number> = of(0);
  private storage :Storage = inject( Storage); 

 
  constructor() { }

  

  saveFormTiular(cliente:Titular){

    return addDoc(this._collection, cliente);
  }

  getFormTitularById(){

    return this._collection;
  }

  patchFormTitular(cliente:Titular, id:string){
    const docRef = doc(this._firestore, `${PATH}/${id}`);
    return updateDoc(docRef, { ...cliente });
  }

  deleteFormTitular(id:string){
    const docRef = doc(this._firestore, `${PATH}/${id}`);
    return updateDoc(docRef, { deleted: true });
  }

  guardarformularioparcial( formulario: any){
    return addDoc(this._collection, formulario);
  }

 
  
  getById(id:string):Observable<any>{  
    const docRef = doc(this._firestore, `${PATH}/${id}`);
    return docData(docRef);
  }

   
  
}
