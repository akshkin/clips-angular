import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';
import { setDoc, doc } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import IUser from '../models/user.model';
import { delay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #auth = inject(Auth);
  #firestore = inject(Firestore);
  authState$ = authState(this.#auth);
  authStateWithDelay$ = this.authState$.pipe(delay(1000));

  constructor() {}

  async createUser(userData: IUser) {
    const userCred = await createUserWithEmailAndPassword(
      this.#auth,
      userData.email,
      userData.password
    );
    await setDoc(doc(this.#firestore, 'users', userCred.user.uid), {
      name: userData.name,
      email: userData.email,
      age: userData.age,
      // phoneNumber: this.form.getRawValue().phoneNumber,
    });

    updateProfile(userCred.user, {
      displayName: userData.name,
    });
  }
}
