import { inject, Injectable } from '@angular/core';
import { MotocicletaProduct } from '../domain/models/Imotocicleta';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDoc, query, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private _firestore = inject(Firestore);
  private motocicletasCache$ = new BehaviorSubject<MotocicletaProduct[] | null>(null); // Caché en memoria de las motocicletas
  private _collectionRef = collection(this._firestore, "motocicleta-producto");

  constructor() { }

  getAllProducts(): Observable<MotocicletaProduct[]> {


    if (this.motocicletasCache$.value) {
      return of(this.motocicletasCache$.value);
    }

    return collectionData(this._collectionRef, { idField: 'id' }).pipe(
      map((data: any[]) => data.map(doc => doc as MotocicletaProduct)), // Convertir a tipo Motocicleta
      tap((motocicletas) => {
        this.motocicletasCache$.next(motocicletas as MotocicletaProduct[]); // Guardar en caché
      }),
      catchError((error) => {
        console.error('Error al cargar los productos', error);
        return of([]); // Evitar fallos en la app
      })
    );
  }








}
