import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from './services/auth-guard.service';

import { HomeComponent } from './pages/home/home.component';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';
import { PostFeedComponent } from './pages/post-feed/post-feed.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'emailVerification',
    component: EmailVerificationComponent,
  },
  {
    path: 'yourFriends',
    loadChildren: () =>
      import('./modules/friends-window/friends-window.module').then(
        (m) => m.FriendsWindowModule
      ),
  },
  {
    path: 'userPage',
    loadChildren: () =>
      import('./modules/main-user-page/main-user-page.module').then(
        (m) => m.MainUserPageModule
      ),
  },
  {
    path: 'friendPage',
    loadChildren: () =>
      import('./modules/friend-page/friend-page.module').then(
        (m) => m.FriendPageModule
      ),
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
