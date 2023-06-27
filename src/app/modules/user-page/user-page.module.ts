import { NgModule } from '@angular/core';
import { UserPageComponent } from '../../tools/user-page/user-page.component';
import { InfoWindowComponent } from '../../tools/info-window/info-window.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [UserPageComponent, InfoWindowComponent],
  exports: [
    CommonModule,
    UserPageComponent,
    InfoWindowComponent,
    MaterialModule,
  ],
})
export class UserPageModule {}
