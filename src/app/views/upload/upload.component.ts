import { Component, inject, signal } from '@angular/core';
import { EventBlockerDirective } from '../../shared/directives/event-blocker.directive';
import { NgClass } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../shared/input/input.component';
import { Storage, ref, uploadBytesResumable } from '@angular/fire/storage';

@Component({
  selector: 'app-upload',
  imports: [
    EventBlockerDirective,
    NgClass,
    ReactiveFormsModule,
    InputComponent,
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css',
})
export class UploadComponent {
  isDragOver = signal(false);
  file = signal<File | null>(null);
  isNextStep = signal(false);
  formBuilder = inject(FormBuilder);
  #storage = inject(Storage);

  form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
  });

  storeFile($event: Event) {
    this.isDragOver.set(false);
    this.file.set(($event as DragEvent).dataTransfer?.files.item(0) ?? null);

    if (this.file()?.type !== 'video/mp4') return;

    this.form.controls.title.setValue(
      this.file()?.name.replace(/\.[^/.]+$/, '') ?? ''
    );
    this.isNextStep.set(true);

    console.log(this.file());
  }

  uploadFile() {
    console.log('File uploaded');
    const clipPath = `clips/${this.file()?.name}.mp4`;

    const clipRef = ref(this.#storage, clipPath);
    uploadBytesResumable(clipRef, this.file() as File);
  }
}
