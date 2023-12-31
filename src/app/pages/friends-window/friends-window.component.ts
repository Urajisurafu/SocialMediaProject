import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivatedRoute } from '@angular/router';

import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-friends-window',
  templateUrl: './friends-window.component.html',
  styleUrls: ['./friends-window.component.scss'],
})
export class FriendsWindowComponent implements OnInit, OnDestroy {
  private storageSubscription: Subscription | undefined;
  private routeParamsSubscription: Subscription | undefined;

  friendsGroup: string = 'Friends';
  backgroundStorage: string = '';
  constructor(
    @Inject(StorageService) private storageService: StorageService,
    private route: ActivatedRoute
  ) {
    this.routeParamsSubscription = this.route.params.subscribe((params) => {
      this.friendsGroup = params['friendsGroup'];
    });
  }
  ngOnInit() {
    const storagePath = 'Background/friends-window.jpg';
    this.storageSubscription = this.storageService
      .getDataFromStorage(storagePath)
      .subscribe((data: string) => (this.backgroundStorage = `url(${data})`));
  }

  ngOnDestroy() {
    if (this.storageSubscription) {
      this.storageSubscription.unsubscribe();
    }
    if (this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe();
    }
  }
}
