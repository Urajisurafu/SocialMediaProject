import { Component } from '@angular/core';

import { UserDataService } from './services/user-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'SocialMediaProject';

  constructor(private userDataService: UserDataService) {
    this.userDataService.checkLoginStatus();
  }

  getIsLoggedIn() {
    return this.userDataService.isLoggedIn;
  }

  getUserHasProfile() {
    return this.userDataService.userHasProfile;
  }
}
