import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { UserDataService } from '../../services/user-data.service';
import { UserPageService } from '../../services/user-page.service';
import { PostService } from '../../services/post.service';

import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ReplyComponent } from '../reply/reply.component';

import { PostData } from '../../interfaces/post-data.interface';
import { UserData } from '../../interfaces/user-data.interface';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  providers: [PostService],
})
export class PostComponent implements OnInit, OnDestroy {
  @Input() postData!: PostData;

  private dialogRefSubscription: Subscription | undefined;
  private usersLikesSubscription: Subscription | undefined;

  users: UserData[] = [];
  isInfoWindow = false;
  hideInfoWindowTimeout: any;
  delayBeforeHide: number = 1000;

  constructor(
    private dialog: MatDialog,
    private userDataService: UserDataService,
    public postService: PostService,
    private userPageService: UserPageService
  ) {}

  ngOnInit() {
    this.postService.getCreatorInfo(this.postData);
    this.postService.getLikes(this.postData.postId);
    this.usersLikesSubscription = this.postService
      .getUsersLikes(this.postData.postId)
      .subscribe((data) => {
        this.users = data.filter((user) => user !== undefined) as UserData[];
      });
  }

  ngOnDestroy() {
    if (this.dialogRefSubscription) {
      this.dialogRefSubscription.unsubscribe();
    }

    if (this.usersLikesSubscription) {
      this.usersLikesSubscription.unsubscribe();
    }
  }

  showInfoWindow() {
    this.isInfoWindow = true;
  }

  startHideInfoWindowTimer() {
    clearTimeout(this.hideInfoWindowTimeout);

    this.hideInfoWindowTimeout = setTimeout(() => {
      this.hideInfoWindow();
    }, this.delayBeforeHide);
  }

  resetHideInfoWindowTimer() {
    clearTimeout(this.hideInfoWindowTimeout);
  }

  hideInfoWindow() {
    this.isInfoWindow = false;
  }

  getDate() {
    const timestamp: any = this.postData.timestamp;
    const date: Date = timestamp.toDate();

    return date;
  }

  getCreatorName() {
    return this.postService.creatorName;
  }

  getIsLiked() {
    return this.postService.isLiked;
  }

  onReplyClick() {
    this.dialog.open(ReplyComponent, { data: this.postData.postId });
  }

  getLikes() {
    return this.postService.likes;
  }

  onLikeClick() {
    this.postService.likeButton(this.postData.postId);
  }

  downloadImageClick() {
    const filePath = `Posts/${this.postData.postId}/image`;
    this.postService.downloadFile(filePath);
  }

  checkDeleteButton() {
    return this.postData.creatorId === this.userDataService.userInfo.userId;
  }

  deletePostClick() {
    const dialogRef = this.dialog.open(InfoModalComponent, {
      data: {
        info: 'Post deletion',
        message: 'Do you really want to remove this post?',
        addButton: true,
        nameButton: 'Yes',
      },
    });

    this.dialogRefSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.postService.deletePost(this.postData.postId);
      }
    });
  }

  getUserImage() {
    return this.postService.creatorImage;
  }

  goToFriendPageClick() {
    this.userPageService.goToFriendPage(this.postData.creatorId);
  }
}
