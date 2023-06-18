import { Component, Input, OnInit } from '@angular/core';

import { ReplyComponent } from '../reply/reply.component';

import { MatDialog } from '@angular/material/dialog';

import { PostData } from '../../interfaces/post-data.interface';
import { UserDataService } from '../../services/user-data.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  providers: [PostService],
})
export class PostComponent implements OnInit {
  @Input() postData!: PostData;

  constructor(
    private dialog: MatDialog,
    private userDataService: UserDataService,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.postService.getCreatorInfo(this.postData);
    this.postService.getLikes(this.postData.postId);
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
    this.postService.deletePost(this.postData.postId);
  }
}
