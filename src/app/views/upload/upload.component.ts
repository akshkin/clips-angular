import { Component, inject, OnDestroy, signal } from '@angular/core';
import { EventBlockerDirective } from '../../shared/directives/event-blocker.directive';
import { NgClass, PercentPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../shared/input/input.component';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
  UploadTask,
} from '@angular/fire/storage';
import { AlertComponent } from '../../shared/alert/alert.component';
import { fromTask } from '@angular/fire/storage';
import { Auth } from '@angular/fire/auth';
import { ClipService } from '../../services/clip.service';
import { Router } from '@angular/router';
import { serverTimestamp, Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-upload',
  imports: [
    EventBlockerDirective,
    NgClass,
    ReactiveFormsModule,
    InputComponent,
    AlertComponent,
    PercentPipe,
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css',
})
export class UploadComponent implements OnDestroy {
  isDragOver = signal(false);
  file = signal<File | null>(null);
  isNextStep = signal(false);
  formBuilder = inject(FormBuilder);
  #storage = inject(Storage);
  showAlert = signal(false);
  alertColor = signal('blue');
  alertMessage = signal('Please wait while your clip is being uploaded');
  inSubmission = signal(false);
  percentage = signal(0);
  showPercentage = signal(false);
  #auth = inject(Auth);
  #clipService = inject(ClipService);
  clipTask?: UploadTask;
  #router = inject(Router);

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
  }

  uploadFile() {
    this.showAlert.set(true);
    this.alertColor.set('blue');
    this.alertMessage.set('Please wait while your clip is being uploaded');
    this.inSubmission.set(true);
    this.showPercentage.set(true);

    const clipPath = `clips/${this.#auth.currentUser?.uid}/${
      this.file()?.name
    }.mp4`;

    const clipRef = ref(this.#storage, clipPath);

    this.clipTask = uploadBytesResumable(clipRef, this.file() as File);

    fromTask(this.clipTask).subscribe({
      next: (snapshot: any) => {
        this.form.disable();
        const progress = snapshot.bytesTransferred / snapshot.totalBytes;
        this.percentage.set(progress);
      },
      error: (error: any) => {
        this.form.enable();
        this.alertColor.set('red');
        this.alertMessage.set(
          'An error occurred while uploading the clip. Please try again later'
        );
        this.inSubmission.set(false);
        this.showPercentage.set(false);
      },
      complete: async () => {
        const clipUrl = await getDownloadURL(clipRef);
        const clip = {
          uid: this.#auth.currentUser?.uid as string,
          displayName: this.#auth.currentUser?.displayName as string,
          title: this.form.controls.title.value,
          fileName: `${this.file()?.name}.mp4`,
          clipUrl,
          timestamp: serverTimestamp() as Timestamp,
        };
        const clipDocRef = await this.#clipService.createClip(clip);

        this.alertColor.set('green');
        this.alertMessage.set('Clip uploaded successfully');

        this.showPercentage.set(false);

        setTimeout(() => {
          this.#router.navigate(['clip', clipDocRef.id]);
        });
      },
    });
  }

  ngOnDestroy(): void {
    this.clipTask?.cancel();
  }
}
