import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { IClip } from '../models/clip.model';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  #firestore = inject(Firestore);
  #clipCollection = collection(this.#firestore, 'clips');
  #auth = inject(Auth);

  constructor() {}

  async createClip(data: IClip) {
    return await addDoc(this.#clipCollection, data);
  }

  async getUserClips() {
    const q = query(
      this.#clipCollection,
      where('uid', '==', this.#auth.currentUser?.uid)
    );
    return await getDocs(q);
  }

  async updateClip(id: string, title: string) {
    const clipRef = doc(this.#firestore, 'clips', id);
    return await updateDoc(clipRef, {
      title,
    });
  }
}
