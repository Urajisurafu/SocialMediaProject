import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { UserDataService } from '../../services/user-data.service';
import { NotificationsService } from '../../services/notifications.service';

import { ChangeDataModalComponent } from '../change-data-modal/change-data-modal.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  private notificationFriendsSubscription: Subscription | undefined;

  notificationFriendsLength: number = 0;
  notificationLikesLength: number = 0;

  constructor(
    private dialog: MatDialog,
    private userDataService: UserDataService,
    private notificationsService: NotificationsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.delayUntilUserInfo();
  }

  ngOnDestroy() {
    if (this.notificationFriendsSubscription) {
      this.notificationFriendsSubscription.unsubscribe();
    }
  }

  private async delayUntilUserInfo() {
    if (!this.userDataService.userInfo?.userId) {
      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });
      await this.delayUntilUserInfo();
    } else {
      this.notificationFriendsSubscription = this.notificationsService
        .getYourNotificationFriends()
        .subscribe(
          (querySnapshot) =>
            (this.notificationFriendsLength = querySnapshot.length)
        );
      this.notificationsService
        .getYourNotificationLikes()
        .subscribe(
          (querySnapshot) =>
            (this.notificationLikesLength = querySnapshot.length)
        );
    }
  }

  changeNicknameClick() {
    this.dialog.open(ChangeDataModalComponent, {
      data: {
        info: 'Change Nickname',
        message: `Your current nickname - ${this.userDataService.userInfo.publicName}`,
        field: 'publicName',
      },
    });
  }

  changeDescriptionClick() {
    this.dialog.open(ChangeDataModalComponent, {
      data: {
        info: 'Change Description',
        message: `Your current description - ${this.userDataService.userInfo.description}`,
        field: 'description',
      },
    });
  }

  deleteAccountClick() {
    this.dialog.open(ChangeDataModalComponent, {
      data: {
        info: 'Delete account',
        message: `Are you sure you want to delete your account? All your posts will be deleted`,
        yesButton: true,
      },
    });
  }

  homaPageClick() {
    this.router.navigate(['userPage']);
  }

  newsClick() {
    this.router.navigate(['postFeed', { postsGroup: 'allPosts' }]);
  }

  friendsPostsClick() {
    this.router.navigate(['postFeed', { postsGroup: 'friendsPosts' }]);
  }

  friendsClick() {
    this.router.navigate(['yourFriends', { friendsGroup: 'friends' }]);
  }

  newFriendsClick() {
    this.router.navigate(['yourFriends', { friendsGroup: 'newFriends' }]);
  }

  newLikesClick() {
    this.router.navigate(['informationLikes']);
  }
}
