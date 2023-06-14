import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import { CreatePostComponent } from '../../tools/create-post/create-post.component';

import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { PostData } from '../../interfaces/post-data.interface';

@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.scss'],
})
export class PostFeedComponent implements OnInit {
  posts: PostData[] = [];
  limit: number = 3;
  constructor(private firestore: AngularFirestore, private dialog: MatDialog) {}

  ngOnInit() {
    this.getPosts();
    window.addEventListener('scroll', this.onScroll.bind(this));
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

  getLimitedAndSortedCollection(
    collectionPath: string
  ): Observable<PostData[]> {
    const documentRef = this.firestore.collection<PostData>(
      collectionPath,
      (ref) => ref.orderBy('timestamp', 'desc')
    );
    return documentRef.valueChanges();
  }

  getPosts() {
    this.getLimitedAndSortedCollection('Posts').subscribe((data) => {
      this.posts = data;
    });
  }
}
