import { Injectable, signal } from '@angular/core';

interface IModal {
  id: string;
  element: HTMLDialogElement;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  modals = signal<IModal[]>([]);

  constructor() {}

  register(id: string, element: HTMLDialogElement) {
    this.modals.set([
      ...this.modals(),
      {
        id,
        element,
      },
    ]);
  }
}
