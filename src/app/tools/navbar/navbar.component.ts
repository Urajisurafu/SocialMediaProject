import { Component } from '@angular/core';

import { UserDataService } from '../../services/user-data.service';
import { AuthenticatorComponent } from '../authenticator/authenticator.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  constructor(
    private userDataService: UserDataService,
    private loginSheet: MatBottomSheet,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  getIsLoggedIn() {
    return this.userDataService.isLoggedIn;
  }

  getUserHasProfile() {
    return this.userDataService.userHasProfile;
  }

  getUserName() {
    return this.userDataService.userInfo?.publicName || '';
  }

  onLoginClick() {
    this.loginSheet.open(AuthenticatorComponent);
  }

  onLogoutClick() {
    this.router.navigate(['']);
    this.afAuth.signOut();
  }
}
