import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePostComponent } from './create-post.component';
import { MaterialModule } from '../../modules/material/material.module';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../environments/environment';
import {
  AngularFirestore,
  AngularFirestoreModule,
} from '@angular/fire/compat/firestore';
import { UserDataService } from '../../services/user-data.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { PostsDataService } from '../../services/posts-data.service';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { LoaderComponent } from '../loader/loader.component';

describe('CreatePostComponent', () => {
  let component: CreatePostComponent;
  let fixture: ComponentFixture<CreatePostComponent>;

  let userDataServiceMock: jasmine.SpyObj<UserDataService>;
  let postsDataServiceMock: jasmine.SpyObj<PostsDataService>;
  let matDialogRefMock: jasmine.SpyObj<MatDialogRef<CreatePostComponent>>;
  let matDialogLoaderRefMock: jasmine.SpyObj<MatDialogRef<LoaderComponent>>;
  let matDialogMock: jasmine.SpyObj<MatDialog>;
  let angularFirestoreMock: jasmine.SpyObj<AngularFirestore>;
  let angularFireStorageMock: jasmine.SpyObj<AngularFireStorage>;

  beforeEach(() => {
    userDataServiceMock = jasmine.createSpyObj(
      'UserDataService',
      ['resetUserName'],
      {
        userInfo: {
          publicName: 'Vlad',
          userId: '123',
          timestamp: new Date(),
          description: 'description',
        },
      }
    );

    matDialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);
    matDialogLoaderRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);
    matDialogMock = jasmine.createSpyObj('MatDialog', ['open'], {
      closeAll: jasmine.createSpy('closeAll'),
    });

    angularFirestoreMock = jasmine.createSpyObj('AngularFirestore', [
      'collection',
      'createId',
    ]);
    angularFireStorageMock = jasmine.createSpyObj('AngularFireStorage', [
      'ref',
      'upload',
    ]);

    postsDataServiceMock = jasmine.createSpyObj('PostsDataService', [
      'uploadImagePost',
      'newGetPosts',
    ]);

    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: UserDataService, useValue: userDataServiceMock },
        { provide: PostsDataService, useValue: postsDataServiceMock },
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: MatDialogRef, useValue: matDialogLoaderRefMock },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: AngularFirestore, useValue: angularFirestoreMock },
        { provide: AngularFireStorage, useValue: angularFireStorageMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      declarations: [CreatePostComponent, LoaderComponent],
    });
    fixture = TestBed.createComponent(CreatePostComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true when "message" control is invalid and touched', () => {
    component.createPostForm.get('message')?.setErrors({ required: true });
    component.createPostForm.get('message')?.markAsTouched();

    const result = component.checkMessage();

    expect(result).toBe(true);
  });

  it('should return false when "message" control is valid or not touched', () => {
    component.createPostForm.get('message')?.setErrors(null);

    const result = component.checkMessage();

    expect(result).toBe(false);
  });

  it('should mark "message" control as touched', () => {
    const messageControl: AbstractControl | null =
      component.createPostForm.get('message');
    if (messageControl) {
      spyOn(messageControl, 'markAsTouched');

      component.onPostClick();

      expect(messageControl.markAsTouched).toHaveBeenCalled();
    }
  });

  it('should return early if "message" control has errors', () => {
    component.createPostForm.get('message')?.setErrors({ required: true });

    spyOn(component, 'uploadImagePost');
    spyOn(component, 'uploadPost');

    component.onPostClick();

    expect(component.uploadImagePost).not.toHaveBeenCalled();
    expect(component.uploadPost).not.toHaveBeenCalled();
  });

  it('should call uploadImagePost if selectedImageFile is truthy', () => {
    component.createPostForm.get('message')?.setErrors(null);
    component.selectedImageFile = new File([], 'image.jpg');

    spyOn(component, 'uploadImagePost');
    spyOn(component, 'uploadPost');

    component.onPostClick();

    expect(component.uploadImagePost).toHaveBeenCalledWith(
      component.createPostForm.get('message')?.value
    );
    expect(component.uploadPost).not.toHaveBeenCalled();
  });

  it('should call uploadPost if selectedImageFile is falsy', () => {
    component.createPostForm.get('message')?.setErrors(null);
    component.selectedImageFile = null;

    spyOn(component, 'uploadImagePost');
    spyOn(component, 'uploadPost');

    component.onPostClick();

    expect(component.uploadImagePost).not.toHaveBeenCalled();
    expect(component.uploadPost).toHaveBeenCalledWith(
      component.createPostForm.get('message')?.value
    );
  });
});
