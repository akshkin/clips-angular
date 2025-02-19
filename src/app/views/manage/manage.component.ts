import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-manage',
  imports: [RouterLink],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css',
})
export class ManageComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  videoOrder = signal('1');

  sort($event: Event) {
    const { value } = $event.target as HTMLSelectElement;

    this.router.navigateByUrl(`/manage?sort=${value}`);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder.set(params['sort'] === '2' ? '2' : '1');
    });
  }
}
