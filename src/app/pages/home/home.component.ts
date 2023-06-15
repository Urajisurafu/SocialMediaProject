import { Component } from '@angular/core';

import { UserDataService } from '../../services/user-data.service';

import { AuthenticatorComponent } from '../../tools/authenticator/authenticator.component';

import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(
    private userDataService: UserDataService,
    private loginSheet: MatBottomSheet
  ) {}

  getIsLoggedIn() {
    return this.userDataService.isLoggedIn;
  }
  onGetStartedClick() {
    this.loginSheet.open(AuthenticatorComponent);
  }
}
