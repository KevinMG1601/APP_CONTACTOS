import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'contacts',
        loadChildren: () => import('../contacts/contacts.module').then((m) => m.ContactsPageModule),
      },
      {
        path: 'tasks',
        loadChildren: () => import('../tasks/tasks.module').then((m) => m.TasksPageModule),
      },
      {
        path: 'fruits',
        loadChildren: () => import('../fruits/fruits.module').then((m) => m.FruitsPageModule),
      },
      {
        path: '',
        redirectTo: 'contacts',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
