import { Component, effect, inject, input, signal } from '@angular/core';
import { ModalComponent } from '../../shared/modal/modal.component';
import { IClip } from '../../models/clip.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../shared/input/input.component';
import { AlertComponent } from '../../shared/alert/alert.component';
import { NgClass } from '@angular/common';
import { ClipService } from '../../services/clip.service';

@Component({
  selector: 'app-edit',
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    InputComponent,
    AlertComponent,
    NgClass,
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent {
  activeClip = input<IClip | null>(null);
  formBuilder = inject(FormBuilder);
  showAlert = signal(false);
  alertColor = signal('blue');
  alertMessage = signal('Updating title....');
  inSubmission = signal(false);
  clipService = inject(ClipService);

  form = this.formBuilder.nonNullable.group({
    id: [''],
    title: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor() {
    effect(() => {
      this.form.controls.id.setValue(this.activeClip()?.docID ?? '');
      this.form.controls.title.setValue(this.activeClip()?.title ?? '');
    });
  }

  async submit() {
    this.showAlert.set(true);
    this.inSubmission.set(true);

    this.alertColor.set('blue');
    this.alertMessage.set('Updating title....');

    try {
      await this.clipService.updateClip(
        this.form.controls.id.value,
        this.form.controls.title.value
      );
    } catch (err) {
      this.inSubmission.set(false);
      this.alertColor.set('red');
      this.alertMessage.set('Something went wrong. Please try again later.');
      return;
    }

    this.inSubmission.set(false);
    this.alertColor.set('green');
    this.alertMessage.set('Title updated successfully!');
  }
}
