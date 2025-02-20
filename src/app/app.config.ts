import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        // apiKey: 'AIzaSyCT6ei5zuFjTu781Ni0panZKOoyOzzf3DU',
        // authDomain: 'angular-clips-10df8.firebaseapp.com',
        // projectId: 'angular-clips-10df8',
        // storageBucket: 'angular-clips-10df8.firebasestorage.app',
        // messagingSenderId: '1031586753906',
        // appId: '1:1031586753906:web:11366934fa101fc18701eb',
        apiKey: 'AIzaSyAAMd20MwCVH6dCDIeLLiG6Nm69C4ldMR0',
        authDomain: 'twitter-ca138.firebaseapp.com',
        projectId: 'twitter-ca138',
        storageBucket: 'twitter-ca138.appspot.com',
        messagingSenderId: '190371803654',
        appId: '1:190371803654:web:d9c628fa4570b3889b8987',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
};
