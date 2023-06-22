import { Component, OnInit } from '@angular/core';

import { CreatePostComponent } from '../../tools/create-post/create-post.component';

import { MatDialog } from '@angular/material/dialog';

import { PostsDataService } from '../../services/posts-data.service';

@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.scss'],
})
export class PostFeedComponent implements OnInit {
  limit: number = 3;
  constructor(
    private dialog: MatDialog,
    private postsDataService: PostsDataService
  ) {}

  ngOnInit() {
    this.postsDataService.getCountOfDocuments();
    this.postsDataService.getFirstPosts();
    this.postsDataService.getScrollPosts();
  }

  getPosts() {
    return this.postsDataService.posts;
  }

  onCreatePostClick() {
    this.dialog.open(CreatePostComponent);
  }
}
