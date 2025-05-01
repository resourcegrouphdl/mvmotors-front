import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), //esto es para que no se rompa la app al hacer click en el boton de enviar
    provideRouter(routes),
    //provideClientHydration(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'motoya-form',
        appId: '1:26647667439:web:388dce55f64aac6115f11a',
        storageBucket: 'motoya-form.appspot.com',
        apiKey: 'AIzaSyDSm_NM4QShVmIhd_5SpJT2WG9tz4h6LLQ',
        authDomain: 'motoya-form.firebaseapp.com',
        messagingSenderId: '26647667439',
        measurementId: 'G-9WCRJ5KVH6',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  
  ],
};
