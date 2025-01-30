import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../shared/input/input.component';
import { AlertComponent } from '../../shared/alert/alert.component';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, InputComponent, AlertComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  formBuilder = inject(FormBuilder);

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

  register() {
    this.showAlert.set(true);
    this.alertMessage.set('Please wait while your account is being created');
    this.alertColor.set('blue');
  }
}
