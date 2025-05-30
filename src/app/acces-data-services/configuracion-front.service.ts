import { inject, Injectable, signal } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { environment } from './envinments';
import { Observable, of, tap } from 'rxjs';
import { CarrucelModel } from '../models/slides-model';
// Removed unused import

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionFrontService {
  

  private _firestore = inject(Firestore);

 private _collection2 = collection(this._firestore, environment.PATH_FIREBASE_CARRUCEL);
 private _collectionBaners = collection(this._firestore, environment.PATH_FIREBASE_BANERS);

 private _cachedSlides: CarrucelModel[] | null = null;
  private _cacheBikes: any[] | null = null;
  private _cacheBaners: any[] | null = null;

  constructor() { }

 // getSlides = signal(collectionData(this._collection2,{ idField: 'id'})as Observable<CarrucelModel[]> );


  getSlides(): Observable<CarrucelModel[]> {
    if (this._cachedSlides) {
      // Si los datos ya están en caché, devolverlos como un Observable
      return of(this._cachedSlides);
    } else {
      // Si no están en caché, realizar la llamada y almacenarlos
      return collectionData(this._collection2, { idField: 'id' }).pipe(
        tap((slides) => (this._cachedSlides = slides as CarrucelModel[]))
      );
    }
  }

  getBaners(): Observable<any[]> {
  
    if (this._cacheBaners) {
      return of(this._cacheBaners);
    } else {
      return collectionData(this._collectionBaners, { idField: 'id' }).pipe(
        tap((baners) => (this._cacheBaners = baners as any[]))
      );
    }
  }  

 


 

}



