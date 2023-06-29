import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { UserDataService } from './services/user-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'SocialMediaProject';

  constructor(
    private userDataService: UserDataService,
    private location: Location
  ) {
    this.userDataService.checkLoginStatus();
  }

  checkUrl() {
    const url = this.location.path();
    return (
      url.includes('postFeed') ||
      url.includes('userPage') ||
      url.includes('friendPage') ||
      url.includes('yourFriends')
    );
  }

  getIsLoggedIn() {
    return this.userDataService.isLoggedIn;
  }

  getUserHasProfile() {
    return this.userDataService.userHasProfile;
  }
}
