import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './core/nav/nav.component';
import { AuthModalComponent } from './user/auth-modal/auth-modal.component';
import { ModalComponent } from './shared/modal/modal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, AuthModalComponent, ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'clips-angular';
}

// ,
// "overrides": {
//   "@angular/fire": {
//     "@angular/common": "^16.0.0",
//     "@angular/core": "^16.0.0",
//     "@angular/platform-browser": "^16.0.0",
//     "@angular/platform-browser-dynamic": "^16.0.0"
//   }
// }
