import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { CreatePostComponent } from '../../tools/create-post/create-post.component';

import { MatDialog } from '@angular/material/dialog';

import { PostsDataService } from '../../services/posts-data.service';
import { StorageService } from '../../services/storage.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.scss'],
})
export class PostFeedComponent implements OnInit, OnDestroy {
  private storageSubscription: Subscription | undefined;
  private postsGroupSubscription: Subscription | undefined;
  limit: number = 3;
  backgroundStorage: string = '';
  postsGroup!: string;
  constructor(
    private dialog: MatDialog,
    private postsDataService: PostsDataService,
    @Inject(StorageService) private storageService: StorageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.postsGroupSubscription = this.route.paramMap.subscribe((params) => {
      const postsGroup = params.get('postsGroup');
      if (postsGroup) this.postsGroup = postsGroup;
    });

    const storagePath = 'Background/post-feed2.jpg';
    this.storageSubscription = this.storageService
      .getDataFromStorage(storagePath)
      .subscribe((data: string) => (this.backgroundStorage = `url(${data})`));
    this.postsDataService.getCountOfDocuments();
    this.postsDataService.getFriendsPosts();
    this.postsDataService.getFirstPosts();
    this.postsDataService.getScrollPosts();
  }
  ngOnDestroy() {
    if (this.storageSubscription) {
      this.storageSubscription.unsubscribe();
    }
    if (this.postsGroupSubscription) {
      this.postsGroupSubscription.unsubscribe();
    }
  }

  getPosts() {
    return this.postsDataService.posts;
  }

  getPostsFriends() {
    return this.postsDataService.sortedPostsFriends;
  }

  onCreatePostClick() {
    this.dialog.open(CreatePostComponent);
  }
}
