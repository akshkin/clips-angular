import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  formBuilder = inject(FormBuilder);

  form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    age: [18],
    email: [''],
    password: [''],
    confirmPassword: [''],
    phoneNumber: [''],
  });
}
