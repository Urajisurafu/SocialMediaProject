import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { MaterialModule } from './modules/material/material.module';

import { UserDataService } from './services/user-data.service';
import { PostsDataService } from './services/posts-data.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';
import { ProfileComponent } from './tools/profile/profile.component';
import { PostFeedComponent } from './pages/post-feed/post-feed.component';
import { CreatePostComponent } from './tools/create-post/create-post.component';
import { PostComponent } from './tools/post/post.component';
import { ReplyComponent } from './tools/reply/reply.component';
import { InfoModalComponent } from './tools/info-modal/info-modal.component';
import { LoaderComponent } from './tools/loader/loader.component';
import { SidebarComponent } from './tools/sidebar/sidebar.component';
import { ChangeDataModalComponent } from './tools/change-data-modal/change-data-modal.component';
import { NavbarComponent } from './tools/navbar/navbar.component';
import { CommentComponent } from './tools/comment/comment.component';
import { PostWindowComponent } from './tools/post-window/post-window.component';
import { PostLikesInfoComponent } from './tools/post-likes-info/post-likes-info.component';
import { UserPageModule } from './modules/user-page/user-page.module';
import { UsersLikesModalComponent } from './tools/users-likes-modal/users-likes-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthenticatorComponent,
    EmailVerificationComponent,
    ProfileComponent,
    PostFeedComponent,
    CreatePostComponent,
    PostComponent,
    ReplyComponent,
    InfoModalComponent,
    LoaderComponent,
    SidebarComponent,
    ChangeDataModalComponent,
    NavbarComponent,
    CommentComponent,
    PostWindowComponent,
    PostLikesInfoComponent,
    PostLikesInfoComponent,
    UsersLikesModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    UserPageModule,
  ],
  providers: [UserDataService, PostsDataService],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
