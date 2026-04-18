import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FruitsPage } from './fruits.page';

const routes: Routes = [
  {
    path: '',
    component: FruitsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FruitsPageRoutingModule {}
