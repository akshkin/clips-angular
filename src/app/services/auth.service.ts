import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@angular/fire/auth';
import { setDoc, doc } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import IUser from '../models/user.model';
import { delay, filter, map, switchMap } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #auth = inject(Auth);
  #firestore = inject(Firestore);
  authState$ = authState(this.#auth);
  authStateWithDelay$ = this.authState$.pipe(delay(1000));
  router = inject(Router);
  route = inject(ActivatedRoute);
  redirect = false;

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event) => {
          let currentRoute = this.route;

          // Navigate to the first child route when the user navigates to a route with children
          while (currentRoute.firstChild) {
            currentRoute = currentRoute.firstChild;
          }
          return currentRoute;
        }),
        switchMap((route) => route.data)
      )
      .subscribe((data) => {
        this.redirect = data['authOnly'] ?? false;
      });
  }

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

  async logout($event: Event) {
    $event?.preventDefault();
    await signOut(this.#auth);
    if (this.redirect) {
      await this.router.navigateByUrl('/');
    }
  }
}
