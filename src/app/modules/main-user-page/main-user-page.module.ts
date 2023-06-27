import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainUserPageComponent } from '../../pages/main-user-page/main-user-page.component';
import { UserPageModule } from '../user-page/user-page.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MainUserPageComponent],
  imports: [
    RouterModule.forChild([{ path: '', component: MainUserPageComponent }]),
    CommonModule,
    UserPageModule,
  ],
})
export class MainUserPageModule {}
