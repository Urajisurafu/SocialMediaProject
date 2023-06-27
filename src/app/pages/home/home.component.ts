import { Component, OnInit } from '@angular/core';

import { UserDataService } from '../../services/user-data.service';

import { AuthenticatorComponent } from '../../tools/authenticator/authenticator.component';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  backgroundStorage: string = '';
  constructor(
    private userDataService: UserDataService,
    private loginSheet: MatBottomSheet,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    const storagePath = 'Background/home_background.jpg'; // Укажите путь к файлу в Firebase Storage
    this.storageService
      .getDataFromStorage(storagePath)
      .subscribe((data) => (this.backgroundStorage = `url(${data})`));
  }

  getIsLoggedIn() {
    return this.userDataService.isLoggedIn;
  }
  onGetStartedClick() {
    this.loginSheet.open(AuthenticatorComponent);
  }
}
