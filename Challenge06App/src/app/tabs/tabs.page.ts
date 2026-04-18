import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage implements OnInit, AfterViewInit {
  @ViewChild(IonTabs) tabs?: IonTabs;

  private readonly storage = inject(Storage);

  async ngOnInit(): Promise<void> {
    await this.storage.create();
  }

  async ngAfterViewInit(): Promise<void> {
    const saved = await this.storage.get<string>('LAST_ION_TAB');
    if (saved && this.tabs) {
      try {
        await this.tabs.select(saved);
      } catch {
        /* tab inválido */
      }
    }
  }

  async onTabsDidChange(ev: CustomEvent<{ tab?: string }>): Promise<void> {
    const tab = ev.detail?.tab;
    if (tab) {
      await this.storage.set('LAST_ION_TAB', tab);
    }
  }
}
