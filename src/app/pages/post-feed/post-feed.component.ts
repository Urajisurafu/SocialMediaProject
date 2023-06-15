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
    this.postsDataService.getPosts();
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  getPosts() {
    return this.postsDataService.posts.slice(0, this.limit);
  }

  onScroll(): void {
    const scrollPosition = window.pageYOffset + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight - 1;
    if (scrollPosition >= pageHeight) {
      this.limit++;
    }
  }

  onCreatePostClick() {
    this.dialog.open(CreatePostComponent);
  }
}
