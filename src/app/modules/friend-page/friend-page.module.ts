import { NgModule } from '@angular/core';
import { FriendUserPageComponent } from '../../pages/friend-user-page/friend-user-page.component';
import { CommonModule } from '@angular/common';
import { UserPageModule } from '../user-page/user-page.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [FriendUserPageComponent],
  imports: [
    RouterModule.forChild([{ path: '', component: FriendUserPageComponent }]),
    CommonModule,
    UserPageModule,
  ],
})
export class FriendPageModule {}
