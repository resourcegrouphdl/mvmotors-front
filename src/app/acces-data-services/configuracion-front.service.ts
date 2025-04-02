import { inject, Injectable, signal } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { environment } from './envinments';
import { Observable } from 'rxjs';
import { CarrucelModel, SlidesModel } from '../models/slides-model';
// Removed unused import

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionFrontService {
  

  private _firestore = inject(Firestore);

  private _collection = collection(this._firestore, environment.PATH_FIREBASE_SLIDES);
  private _collection2 = collection(this._firestore, environment.PATH_FIREBASE_CARRUCEL);


  constructor() { }

  getSlides = signal(collectionData(this._collection2,{ idField: 'id'})as Observable<CarrucelModel[]> );


 


 

}



