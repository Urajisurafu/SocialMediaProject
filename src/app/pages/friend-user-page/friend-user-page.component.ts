import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs';

import { ActivatedRoute } from '@angular/router';

import { FriendPageService } from '../../services/friend-page.service';

import { UserData } from '../../interfaces/user-data.interface';

@Component({
  selector: 'app-friend-user-page',
  templateUrl: './friend-user-page.component.html',
  styleUrls: ['./friend-user-page.component.scss'],
  providers: [FriendPageService],
})
export class FriendUserPageComponent implements OnInit {
  friendInfo!: UserData;
  constructor(
    private route: ActivatedRoute,
    private friendPageService: FriendPageService
  ) {}

  ngOnInit() {
    this.delayUntilFriendInfo();
    this.route.queryParams
      .pipe(
        switchMap((params) =>
          this.friendPageService.getFriendById(params['friendId'])
        )
      )
      .subscribe((snapshot) => {
        this.friendInfo = snapshot.data();
      });
  }

  getIsFriend() {
    return this.friendPageService.isFriend;
  }

  getIsAwaitingConfirmation() {
    return this.friendPageService.isAwaitingConfirmation;
  }

  getFriendId() {
    return this.friendInfo?.userId || '';
  }

  getFriendName() {
    return this.friendInfo?.publicName || '';
  }

  getFriendDescription() {
    return this.friendInfo?.description || '';
  }

  getUserTimestamp() {
    const timestamp: any = this.friendInfo?.timestamp;
    return timestamp ? timestamp.toDate() : '';
  }

  async delayUntilFriendInfo() {
    if (!this.friendInfo?.userId) {
      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });
      await this.delayUntilFriendInfo();
    } else {
      this.friendPageService.getFriendExistence(this.friendInfo.userId);
      this.friendPageService.getFriendCountOfValueFriends(
        this.friendInfo.userId
      );
      this.friendPageService.getFriendCountOfValuePosts(this.friendInfo.userId);
    }
  }

  getFriendPostsLength() {
    return this.friendPageService.friendPosts;
  }

  getFriendFriendsLength() {
    return this.friendPageService.friendFriends;
  }

  handleValueChange(value: boolean) {
    if (value) {
      this.friendPageService.getFriendExistence(this.friendInfo.userId);
    }
  }
}
