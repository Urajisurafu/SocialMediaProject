import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';
import { PostFeedComponent } from './pages/post-feed/post-feed.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'emailVerification', component: EmailVerificationComponent },
  { path: 'postFeed', component: PostFeedComponent },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
