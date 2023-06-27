import { Component, Inject, OnInit } from '@angular/core';

import { CreatePostComponent } from '../../tools/create-post/create-post.component';

import { MatDialog } from '@angular/material/dialog';

import { PostsDataService } from '../../services/posts-data.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.scss'],
})
export class PostFeedComponent implements OnInit {
  limit: number = 3;
  backgroundStorage: string = '';
  constructor(
    private dialog: MatDialog,
    private postsDataService: PostsDataService,
    @Inject(StorageService) private storageService: StorageService
  ) {}

  ngOnInit() {
    const storagePath = 'Background/post-feed2.jpg'; // Укажите путь к файлу в Firebase Storage
    this.storageService
      .getDataFromStorage(storagePath)
      .subscribe((data: any) => (this.backgroundStorage = `url(${data})`));
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
