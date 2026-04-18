import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FruitsPageRoutingModule } from './fruits-routing.module';
import { FruitsPage } from './fruits.page';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, IonicModule, FruitsPageRoutingModule],
  declarations: [FruitsPage],
})
export class FruitsPageModule {}
