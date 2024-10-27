import { inject, Injectable, signal } from '@angular/core';
import { collection, collectionData, Firestore, addDoc, doc, deleteDoc, updateDoc, getDocs } from '@angular/fire/firestore';
import { environment } from './envinments';
import { Observable } from 'rxjs';
import { SlidesModel } from '../models/slides-model';
// Removed unused import

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionFrontService {
  

  private _firestore = inject(Firestore);
  private _collection = collection(this._firestore, environment.PATH_FIREBASE_SLIDES);

  constructor() { }

  getSlides = signal(collectionData(this._collection,{ idField: 'id'})as Observable<SlidesModel[]> );


  createSlide = async (slide: SlidesModel) => {
    try {
      await addDoc(this._collection, slide);
    } catch (error) {
      console.log(error);
    }
  }

  deleteSlide = async (id: string) => {
    try {
      const docRef = doc(this._firestore, `${environment.PATH_FIREBASE_SLIDES}/${id}`);
      await deleteDoc(docRef);
    } catch (error) {
      console.log(error);
    }
  }

  putSlide = async (slide: SlidesModel, id: string) => {
    try {
      const docRef = doc(this._firestore, `${environment.PATH_FIREBASE_SLIDES}/${id}`);
      await updateDoc(docRef, { ...slide });
    } catch (error) {
      console.log(error);
    }
  }
  pathSlide = async (slide: SlidesModel, id: string) => {
    try {
      const docRef = doc(this._firestore, `${environment.PATH_FIREBASE_SLIDES}/${id}`);
      await updateDoc(docRef, { ...slide });
    } catch (error) {
      console.log(error);
    }
  }

  updateSlide = async (slide: SlidesModel, id: string) => {
    try {
      const docRef = doc(this._firestore, `${environment.PATH_FIREBASE_SLIDES}/${id}`);
      await updateDoc(docRef, { ...slide });
    } catch (error) {
      console.log(error);
    }
  }

  getAllSlides = async () => {
    try {
      const querySnapshot = await getDocs(this._collection);
      const slides = querySnapshot.docs.map(doc => doc.data() as SlidesModel);
      return slides;
    } catch (error) {
      console.log(error);
      return null; // Ensure a value is always returned
    }
  }

}


