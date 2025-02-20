import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { ClipService } from '../../services/clip.service';
import { IClip } from '../../models/clip.model';

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
  clipService = inject(ClipService);
  clips = signal<IClip[]>([]);

  sort($event: Event) {
    const { value } = $event.target as HTMLSelectElement;

    this.router.navigateByUrl(`/manage?sort=${value}`);
  }

  async ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder.set(params['sort'] === '2' ? '2' : '1');
    });

    const results = await this.clipService.getUserClips();
    results.forEach((document) => {
      const data = document.data();
      this.clips.set([
        ...this.clips(),
        {
          docID: document.id,
          uid: data['uid'],
          displayName: data['displayName'],
          title: data['title'],
          fileName: data['fileName'],
          clipUrl: data['clipUrl'],
          timestamp: data['timestamp'],
        },
      ]);
    });
  }
}
