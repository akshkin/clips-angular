import {
  Component,
  inject,
  input,
  viewChild,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  modal = inject(ModalService);

  id = input.required<string>();
  dialog = viewChild.required<ElementRef<HTMLDialogElement>>('baseDialog');

  ngAfterViewInit() {
    this.modal.register(this.id(), this.dialog().nativeElement);
  }
}
