import { AfterContentInit, Component, contentChildren } from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-tabs-container',
  imports: [NgClass],
  templateUrl: './tabs-container.component.html',
  styleUrl: './tabs-container.component.css',
})
export class TabsContainerComponent implements AfterContentInit {
  tabs = contentChildren(TabComponent);

  ngAfterContentInit() {
    const activeTab = this.tabs().find((tab) => tab.isActive() === true);
    if (!activeTab) {
      this.selectTab(this.tabs()[0]);
    }
  }

  selectTab(tab: TabComponent) {
    this.tabs().forEach((tab) => tab.isActive.set(false));
    tab.isActive.set(true);
    // to avoid changing the url when tab is selected as they are links -- an alternative to event.preventDefault
    return false;
  }
}
