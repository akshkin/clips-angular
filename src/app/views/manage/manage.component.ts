import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { ClipService } from '../../services/clip.service';
import { IClip } from '../../models/clip.model';
import { EditComponent } from '../../video/edit/edit.component';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-manage',
  imports: [RouterLink, EditComponent],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css',
})
export class ManageComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  videoOrder = signal('1');
  clipService = inject(ClipService);
  clips = signal<IClip[]>([]);
  modal = inject(ModalService);
  activeClip = signal<IClip | null>(null);
  orderedClips = computed(() => {
    return this.clips().sort((a, b) => {
      return this.videoOrder() === '1'
        ? a.timestamp.toMillis() - b.timestamp.toMillis()
        : b.timestamp.toMillis() - a.timestamp.toMillis();
    });
  });

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

  openModal($event: Event, clip: IClip) {
    $event.preventDefault();

    this.modal.toggle('editClip');
    this.activeClip.set(clip);
  }

  update($event: IClip) {
    const currentClips = this.clips();

    currentClips.forEach((element, index) => {
      if (element.docID === $event.docID) {
        currentClips[index].title = $event.title;
      }
    });

    this.clips.set(currentClips);
  }

  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault();

    this.clipService.deleteClip(clip);

    const currentClips = this.clips();

    currentClips.forEach((element, index) => {
      if (element.docID === clip.docID) {
        currentClips.splice(index, 1);
      }
    });

    this.clips.set(currentClips);
  }
}
