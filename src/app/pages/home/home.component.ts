import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { UserDataService } from '../../services/user-data.service';

import { AuthenticatorComponent } from '../../tools/authenticator/authenticator.component';

import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { StorageService } from '../../services/storage.service';
import { LikesWindowService } from '../../services/likes-window.service';
import { UserPageService } from '../../services/user-page.service';
import { FriendsWindowService } from '../../services/friends-window.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private storageSubscription: Subscription | undefined;
  backgroundStorage: string = '';
  constructor(
    private userDataService: UserDataService,
    private loginSheet: MatBottomSheet,
    private likesWindowService: LikesWindowService,
    private userPageService: UserPageService,
    private friendsWindowService: FriendsWindowService,
    @Inject(StorageService) private storageService: StorageService
  ) {}

  ngOnInit() {
    this.likesWindowService.resetLikesWindowService();
    this.userDataService.resetUserDataService();
    this.userPageService.resetUserPageService();
    this.friendsWindowService.resetFriendsWindowService();

    const storagePath = 'Background/home_background.jpg';
    this.storageSubscription = this.storageService
      .getDataFromStorage(storagePath)
      .subscribe((data) => (this.backgroundStorage = `url(${data})`));
  }

  ngOnDestroy() {
    if (this.storageSubscription) {
      this.storageSubscription.unsubscribe();
    }
  }

  getIsLoggedIn() {
    return this.userDataService.isLoggedIn;
  }
  onGetStartedClick() {
    this.loginSheet.open(AuthenticatorComponent);
  }
}
