import { AfterContentInit, Component, contentChildren } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  imports: [],
  templateUrl: './tabs-container.component.html',
  styleUrl: './tabs-container.component.css',
})
export class TabsContainerComponent implements AfterContentInit {
  tabs = contentChildren(TabComponent);

  ngAfterContentInit() {
    console.log(this.tabs);
  }
}
