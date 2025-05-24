import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection } from '@angular/fire/firestore';
import { addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collectionData } from '@angular/fire/firestore';
import { doc } from '@angular/fire/firestore';
import { getDoc } from '@angular/fire/firestore';
import { query } from '@angular/fire/firestore';
import { updateDoc } from '@angular/fire/firestore';
import { deleteDoc } from '@angular/fire/firestore';
import { where } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const FIREBASE_TABLA_RECLAMACIONES = 'reclamaciones';

@Injectable({
  providedIn: 'root'
})
export class ReclamacionesService {

  _firestore = inject(Firestore);
  _collectionRef = collection(this._firestore, FIREBASE_TABLA_RECLAMACIONES);
  collectionReclamaciones = collectionData(this._collectionRef);

  constructor() { }

  guardarReclamacion(reclamacion: any): Promise<void> {
    return addDoc(this._collectionRef, reclamacion)
      .then(() => {
        console.log('Reclamación guardada correctamente');
      })
      .catch((error) => {
        console.error('Error al guardar la reclamación: ', error);
      });
  }

}
