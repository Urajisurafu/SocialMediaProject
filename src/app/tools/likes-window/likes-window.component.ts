import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { UserPageService } from '../../services/user-page.service';
import { NotificationsService } from '../../services/notifications.service';
import { UserDataService } from '../../services/user-data.service';
import { LikesWindowService } from '../../services/likes-window.service';

import { PostWindowComponent } from '../post-window/post-window.component';
import { InfoModalComponent } from '../info-modal/info-modal.component';

import { UserNotificationLikes } from '../../interfaces/user-data.interface';
import { PostData } from '../../interfaces/post-data.interface';

@Component({
  selector: 'app-likes-window',
  templateUrl: './likes-window.component.html',
  styleUrls: ['./likes-window.component.scss'],
})
export class LikesWindowComponent implements OnInit, OnDestroy {
  private likesWindowServiceSubscription: Subscription | undefined;
  private dialogRefSubscription: Subscription | undefined;

  selectedUsers: UserNotificationLikes[] = [];
  constructor(
    private userPageService: UserPageService,
    private likesWindowService: LikesWindowService,
    private userDataService: UserDataService,
    private notificationsService: NotificationsService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.delayUntilUserInfo();
  }

  ngOnDestroy() {
    if (this.likesWindowServiceSubscription)
      this.likesWindowServiceSubscription.unsubscribe();
    if (this.dialogRefSubscription) this.dialogRefSubscription.unsubscribe();
  }

  async delayUntilUserInfo() {
    if (!this.userDataService.userInfo?.userId) {
      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });

      await this.delayUntilUserInfo();
    } else {
      this.likesWindowServiceSubscription = this.likesWindowService
        .getYourNotificationLikes()
        .subscribe();
    }
  }

  deleteSelectedLikes() {
    if (this.selectedUsers.length > 0) {
      const dialogRef = this.dialog.open(InfoModalComponent, {
        data: {
          info: 'Removing notifications',
          message: 'Do you really want to delete the selected notifications?',
          addButton: true,
          nameButton: 'Yes',
        },
      });

      this.dialogRefSubscription = dialogRef
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            this.selectedUsers.forEach((user) => {
              this.notificationsService.deleteCheckedNotificationLike(
                user.notificationLikeId
              );
              this.selectedUsers = [];
            });
          }
        });
    }
  }

  getNotificationLikesList() {
    return this.likesWindowService.listOfNotificationLikes;
  }

  isNoHaveNotificationLikes() {
    if (this.likesWindowService.listOfNotificationLikes) {
      return this.likesWindowService.listOfNotificationLikes.length <= 0;
    }
    return;
  }

  goToFriendPageClick(creatorId: string) {
    this.userPageService.goToFriendPage(creatorId);
  }

  onCheckboxChange(user: UserNotificationLikes) {
    const index = this.selectedUsers.findIndex(
      (selectedUser) =>
        selectedUser.notificationLikeId === user.notificationLikeId
    );

    if (index !== -1) {
      this.selectedUsers.splice(index, 1);
    } else {
      this.selectedUsers.push(user);
    }
  }

  isChecked(user: UserNotificationLikes): boolean {
    const index = this.selectedUsers.findIndex(
      (selectedUser) =>
        selectedUser.notificationLikeId === user.notificationLikeId
    );

    return index !== -1;
  }

  toggleSelectAll() {
    if (this.selectedUsers.length === this.getNotificationLikesList().length) {
      this.selectedUsers = [];
    } else {
      this.selectedUsers = this.getNotificationLikesList();
    }
  }

  showPost(post: PostData) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = post;
    this.dialog.open(PostWindowComponent, dialogConfig);
  }
}
