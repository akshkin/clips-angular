import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-clip',
  imports: [],
  templateUrl: './clip.component.html',
  styleUrl: './clip.component.css',
})
export class ClipComponent implements OnInit {
  route = inject(ActivatedRoute);
  clipId = signal('');

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.clipId.set(params['id']);
    });
  }
}
