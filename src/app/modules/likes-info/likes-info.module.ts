import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { InformationLikesComponent } from '../../pages/information-likes/information-likes.component';
import { LikesWindowComponent } from '../../tools/likes-window/likes-window.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [InformationLikesComponent, LikesWindowComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild([{ path: '', component: InformationLikesComponent }]),
  ],
})
export class LikesInfoModule {}
