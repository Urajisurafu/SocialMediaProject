import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../../services/user-data.service';
import { UserPageService } from '../../services/user-page.service';

@Component({
  selector: 'app-main-user-page',
  templateUrl: './main-user-page.component.html',
  styleUrls: ['./main-user-page.component.scss'],
})
export class MainUserPageComponent implements OnInit {
  constructor(
    private userDataService: UserDataService,
    private mainUserPageService: UserPageService
  ) {}

  ngOnInit() {
    this.delayUntilUserInfo();
  }

  getUserInfo() {
    return this.userDataService.userInfo;
  }

  getUserName() {
    return this.userDataService.userInfo?.publicName || '';
  }

  getUserDescription() {
    return this.userDataService.userInfo?.description || '';
  }

  getUserTimestamp() {
    const timestamp: any = this.userDataService.userInfo?.timestamp;
    if (timestamp) {
      return timestamp.toDate();
    } else {
      return '';
    }
  }

  getUserPostsLength() {
    return this.mainUserPageService.userPosts;
  }

  getUserFriendsLength() {
    return this.mainUserPageService.userFriends;
  }

  async delayUntilUserInfo() {
    if (!this.userDataService.userInfo?.userId) {
      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });

      await this.delayUntilUserInfo();
    } else {
      this.mainUserPageService.getCountOfValueFriends(
        this.userDataService.userInfo.userId
      );
      this.mainUserPageService.getCountOfValuePosts(
        this.userDataService.userInfo.userId
      );
    }
  }
}
