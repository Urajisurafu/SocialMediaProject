import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { UserDataService } from '../../services/user-data.service';

import { AuthenticatorComponent } from '../../tools/authenticator/authenticator.component';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { StorageService } from '../../services/storage.service';

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
    @Inject(StorageService) private storageService: StorageService
  ) {}

  ngOnInit() {
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
