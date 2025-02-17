import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../shared/input/input.component';
import { AlertComponent } from '../../shared/alert/alert.component';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, InputComponent, AlertComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  formBuilder = inject(FormBuilder);
  #auth = inject(Auth);
  #firestore = inject(Firestore);

  form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    age: [18, [Validators.required, Validators.min(18)]],
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
    confirmPassword: ['', [Validators.required]],
    phoneNumber: [''],
  });

  showAlert = signal(false);
  alertMessage = signal('Please wait while your account is being created');
  alertColor = signal('blue');
  inSubmission = signal(false);

  async register() {
    this.showAlert.set(true);
    this.alertMessage.set('Please wait while your account is being created');
    this.alertColor.set('blue');
    this.inSubmission.set(true);

    const { email, password } = this.form.getRawValue();

    try {
      const userCred = await createUserWithEmailAndPassword(
        this.#auth,
        email,
        password
      );
      await addDoc(collection(this.#firestore, 'users'), {
        name: this.form.getRawValue().name,
        email: this.form.getRawValue().email,
        age: this.form.getRawValue().age,
        // phoneNumber: this.form.getRawValue().phoneNumber,
      });
    } catch (err: any) {
      console.error(err);
      this.alertMessage.set(
        'An unexpected error occured, please try again later'
      );
      this.alertColor.set('red');
      this.inSubmission.set(false);
      return;
    }

    this.alertMessage.set('Account created successfully!');
    this.alertColor.set('green');
    this.form.reset();
    this.showAlert.set(false);
  }
}
