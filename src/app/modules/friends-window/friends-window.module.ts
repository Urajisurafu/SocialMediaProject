import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';

import { FriendsWindowComponent } from '../../pages/friends-window/friends-window.component';
import { FriendsInfoWindowComponent } from '../../tools/friends-info-window/friends-info-window.component';

@NgModule({
  declarations: [FriendsWindowComponent, FriendsInfoWindowComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild([{ path: '', component: FriendsWindowComponent }]),
  ],
})
export class FriendsWindowModule {}
