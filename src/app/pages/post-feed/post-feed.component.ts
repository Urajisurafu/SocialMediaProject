import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { CreatePostComponent } from '../../tools/create-post/create-post.component';

import { MatDialog } from '@angular/material/dialog';

import { PostsDataService } from '../../services/posts-data.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.scss'],
})
export class PostFeedComponent implements OnInit, OnDestroy {
  private storageSubscription: Subscription | undefined;
  limit: number = 3;
  backgroundStorage: string = '';
  constructor(
    private dialog: MatDialog,
    private postsDataService: PostsDataService,
    @Inject(StorageService) private storageService: StorageService
  ) {}

  ngOnInit() {
    const storagePath = 'Background/post-feed2.jpg'; // Укажите путь к файлу в Firebase Storage
    this.storageSubscription = this.storageService
      .getDataFromStorage(storagePath)
      .subscribe((data: any) => (this.backgroundStorage = `url(${data})`));
    this.postsDataService.getCountOfDocuments();
    this.postsDataService.getFirstPosts();
    this.postsDataService.getScrollPosts();
  }
  ngOnDestroy() {
    if (this.storageSubscription) {
      this.storageSubscription.unsubscribe();
    }
  }

  getPosts() {
    return this.postsDataService.posts;
  }

  onCreatePostClick() {
    this.dialog.open(CreatePostComponent);
  }
}
