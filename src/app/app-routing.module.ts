import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from './services/auth-guard.service';

import { HomeComponent } from './pages/home/home.component';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';
import { PostFeedComponent } from './pages/post-feed/post-feed.component';
import { MainUserPageComponent } from './pages/main-user-page/main-user-page.component';
import { FriendUserPageComponent } from './pages/friend-user-page/friend-user-page.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'emailVerification',
    component: EmailVerificationComponent,
  },
  {
    path: 'userPage',
    component: MainUserPageComponent,
  },
  {
    path: 'friendPage',
    component: FriendUserPageComponent,
  },
  {
    path: 'postFeed',
    component: PostFeedComponent,
    canActivate: [AuthGuardService],
  },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService],
})
export class AppRoutingModule {}
