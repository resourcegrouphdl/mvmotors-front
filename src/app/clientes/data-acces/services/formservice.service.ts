import { inject, Injectable } from '@angular/core';
import { Titular } from '../titular';
import { collection, Firestore, addDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from "@angular/fire/storage";


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

 
  
  getById(id:string){
    return doc(this._firestore, `${PATH}/${id}`);
  }

   
  /*async uploadImage(file: File, campo: string) {
    this.isUploading = true;
    const filePath = `images/${Date.now()}_${file}`; // Ruta en el storage
    

    const storageRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',(onSnapshot)=>{
      this.uploadProgress = of((onSnapshot.bytesTransferred / onSnapshot.totalBytes) * 100);
     
      switch (onSnapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }

    

    }
    ,(error)=>{
      console.log('error',error);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        this.formularioCliente.get(campo)!.setValue(downloadURL);
        this.isUploading = false;
        this.isUploaded = true;
      });
    }
    )

}*/
}
