import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostData } from '../interfaces/post-data.interface';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable()
export class PostsDataService {
  posts: PostData[] = [];
  constructor(private firestore: AngularFirestore) {}

  getSortedCollection(collectionPath: string): Observable<PostData[]> {
    const documentRef = this.firestore.collection<PostData>(
      collectionPath,
      (ref) => ref.orderBy('timestamp', 'desc')
    );
    return documentRef.valueChanges();
  }

  getPosts(): void {
    this.getSortedCollection('Posts').subscribe((data) => (this.posts = data));
  }
}
