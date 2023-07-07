import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserDataService } from '../../services/user-data.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userDataServiceMock: jasmine.SpyObj<UserDataService>;

  beforeEach(() => {
    userDataServiceMock = jasmine.createSpyObj('UserDataService', [
      'createUser',
    ]);

    TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: UserDataService, useValue: userDataServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createUser and reset the form if nickname and description are valid', () => {
    const form = new FormGroup({
      nickname: new FormControl('Vlad'),
      description: new FormControl('Some description'),
    });

    component.profileForm = form;

    component.onContinueClick();

    expect(userDataServiceMock.createUser).toHaveBeenCalledWith(
      'Vlad',
      'Some description'
    );
    expect(component.profileForm.pristine).toBe(true);
  });

  it('should not call createUser if nickname or description are invalid', () => {
    const form = new FormGroup({
      nickname: new FormControl('', Validators.required),
      description: new FormControl('Some description'),
    });
    component.profileForm = form;

    component.onContinueClick();

    expect(userDataServiceMock.createUser).not.toHaveBeenCalled();
  });
});
