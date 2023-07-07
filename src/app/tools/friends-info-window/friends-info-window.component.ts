import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { FriendsWindowService } from '../../services/friends-window.service';
import { UserDataService } from '../../services/user-data.service';
import { UserPageService } from '../../services/user-page.service';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-friends-info-window',
  templateUrl: './friends-info-window.component.html',
  styleUrls: ['./friends-info-window.component.scss'],
})
export class FriendsInfoWindowComponent implements OnInit, OnDestroy {
  @Input() friendsGroup?: string = 'Friends';

  private yourCurrentFriendsInfo: Subscription | undefined;
  private yourNotificationFriends: Subscription | undefined;

  constructor(
    public friendsWindowService: FriendsWindowService,
    private userDataService: UserDataService,
    private userPageService: UserPageService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit() {
    this.delayUntilUserInfo();
  }

  ngOnDestroy() {
    this.yourCurrentFriendsInfo?.unsubscribe();
    this.yourNotificationFriends?.unsubscribe();
  }

  checkIndex() {
    if (this.friendsGroup === 'newFriends') {
      return 1;
    } else {
      return 0;
    }
  }

  getListOfFriends() {
    return this.friendsWindowService.listOfFriends;
  }

  getListOfNotificationFriends() {
    return this.friendsWindowService.listOfNotificationFriends;
  }

  isNoHaveFriends() {
    if (this.friendsWindowService.listOfNotificationFriends) {
      return this.friendsWindowService.listOfFriends?.length <= 0;
    }
    return;
  }

  isNoHaveNotificationFriends() {
    if (this.friendsWindowService.listOfNotificationFriends) {
      return this.friendsWindowService.listOfNotificationFriends.length <= 0;
    }
    return;
  }

  deleteFriendClick(friendId: string) {
    this.userPageService.deleteFriend(friendId);
  }

  rejectFriendClick(friendId: string) {
    const yourId = this.userDataService.getCurrentUserId();
    this.userPageService.deleteFriend(friendId);
    this.notificationsService.deleteNotificationFriend(yourId, friendId);
  }

  addToFriendsClick(friendId: string) {
    this.userPageService.addToFriends(friendId);
  }

  goToFriendPageClick(creatorId: string) {
    this.userPageService.goToFriendPage(creatorId);
  }

  private async delayUntilUserInfo() {
    if (!this.userDataService.userInfo?.userId) {
      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });

      await this.delayUntilUserInfo();
    } else {
      this.yourCurrentFriendsInfo = this.friendsWindowService
        .getYourCurrentFriendsInfo()
        .subscribe();
      this.yourNotificationFriends = this.friendsWindowService
        .getYourNotificationFriends()
        .subscribe();
    }
  }
}
