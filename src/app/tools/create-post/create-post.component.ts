import { Component } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { UserDataService } from '../../services/user-data.service';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { PostData } from '../../interfaces/post-data.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { finalize, tap } from 'rxjs';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent {
  selectedImageFile!: File;
  createPostForm: FormGroup;
  private collection: AngularFirestoreCollection<PostData>;

  constructor(
    private storage: AngularFireStorage,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private userDataService: UserDataService,
    private dialogCreatePost: MatDialogRef<CreatePostComponent>,
    private dialogOpen: MatDialog
  ) {
    this.collection = this.firestore.collection<PostData>('Posts');

    this.createPostForm = new FormGroup({
      message: new FormControl('', [Validators.required]),
    });
  }

  checkMessage() {
    return !!(
      this.createPostForm.get('message')?.invalid &&
      this.createPostForm.get('message')?.touched
    );
  }

  onPostClick() {
    const comment = this.createPostForm.get('message');
    comment?.markAsTouched();

    if (comment?.errors) return;

    if (this.selectedImageFile) {
      this.uploadImagePost(comment?.value);
    } else {
      this.uploadPost(comment?.value);
    }
  }

  uploadImagePost(comment: string) {
    const postId = this.firestore.createId();

    const filePath = `Posts/${postId}/image`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.selectedImageFile);

    const dialogRef = this.dialogOpen.open(LoaderComponent, {
      data: {
        info: `Upload progress`,
        message: '',
      },
    });

    task
      .percentageChanges()
      .pipe(
        tap((percentage) => {
          dialogRef.componentInstance.message = {
            info: `Upload progress`,
            message: `Upload progress: ${percentage?.toFixed(2)}%`,
          };
        }),
        finalize(() => dialogRef.close())
      )
      .subscribe();

    task.snapshotChanges().subscribe((snapshot) => {
      if (snapshot!.state === 'success') {
        fileRef.getDownloadURL().subscribe(
          (url) => {
            this.collection
              .doc(postId)
              .set({
                comment: comment,
                creatorId: this.userDataService.getCurrentUserId(),
                imageUrl: url,
                timestamp: new Date(),
                postId: postId,
              })
              .then(() => {
                this.dialogCreatePost.close();
              })
              .catch((error) => {
                console.error('Error writing document: ', error);
              });
          },
          (error) => {
            console.error('Error getting image URL:', error);
          }
        );
      }
    });
  }

  uploadPost(comment: string) {
    const postId = this.firestore.createId();
    this.collection
      .doc(postId)
      .set({
        comment: comment,
        creatorId: this.userDataService.getCurrentUserId(),
        timestamp: new Date(),
        postId: postId,
      })
      .then(() => {
        this.dialogCreatePost.close();
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
  }

  photoSelected(photoSelector: HTMLInputElement) {
    this.selectedImageFile = photoSelector.files![0];

    if (!this.selectedImageFile) return;

    const fileReader = new FileReader();
    fileReader.readAsDataURL(this.selectedImageFile);
    fileReader.addEventListener('loadend', (ev) => {
      const readableString = fileReader.result!.toString();
      const postPreviewImage = <HTMLImageElement>(
        document.getElementById('post-preview-image')
      );
      postPreviewImage.src = readableString;
    });
  }
}