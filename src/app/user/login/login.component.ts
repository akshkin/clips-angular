import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InputComponent } from '../../shared/input/input.component';
import { AlertComponent } from '../../shared/alert/alert.component';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputComponent, AlertComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  formBuilder = inject(FormBuilder);
  auth = inject(Auth);
  inSubmission = signal(false);

  form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
        ),
      ],
    ],
  });

  showAlert = signal(false);
  alertMessage = signal('Please wait while you are being logged in...');
  alertColor = signal('blue');

  constructor() {}

  async login() {
    this.showAlert.set(true);
    this.alertMessage.set('Loggin in....');
    this.alertColor.set('blue');
    this.inSubmission.set(true);

    try {
      await signInWithEmailAndPassword(
        this.auth,
        this.form.getRawValue().email,
        this.form.getRawValue().password
      );
    } catch (err) {
      console.error(err);
      this.showAlert.set(true);
      this.alertMessage.set('Could not login. Please try again later');
      this.alertColor.set('red');
      this.inSubmission.set(false);
      return;
    }

    this.form.reset();
    this.alertMessage.set('Successfully logged in');
    this.alertColor.set('green');
  }
}
