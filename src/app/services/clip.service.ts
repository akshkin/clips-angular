import { inject, Injectable } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { IClip } from '../models/clip.model';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  #firestore = inject(Firestore);
  #clipCollection = collection(this.#firestore, 'clips');

  constructor() {}

  async createClip(data: IClip) {
    return await addDoc(this.#clipCollection, data);
  }
}
