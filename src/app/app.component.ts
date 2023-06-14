import { Component } from '@angular/core';

import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { UserDataService } from './services/user-data.service';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'SocialMediaProject';

  constructor(
    public userDataService: UserDataService,
    private loginSheet: MatBottomSheet,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.userDataService.checkLoginStatus();
  }

  onLoginClick() {
    this.loginSheet.open(AuthenticatorComponent);
  }

  onLogoutClick() {
    this.router.navigate(['']);
    this.afAuth.signOut();
  }
}
