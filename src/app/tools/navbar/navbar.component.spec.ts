import { ComponentFixture, TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { MaterialModule } from '../../modules/material/material.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { UserDataService } from '../../services/user-data.service';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  let userDataServiceMock: jasmine.SpyObj<UserDataService>;
  let matBottomSheetMock: jasmine.SpyObj<MatBottomSheet>;
  let routerMock: jasmine.SpyObj<Router>;
  let afAuthMock: jasmine.SpyObj<AngularFireAuth>;

  beforeEach(() => {
    matBottomSheetMock = jasmine.createSpyObj('MatBottomSheet', ['open']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    afAuthMock = jasmine.createSpyObj('AngularFireAuth', ['signOut']);
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

    userDataServiceMock.isLoggedIn = true;
    userDataServiceMock.userHasProfile = true;

    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
      ],
      declarations: [NavbarComponent],
      providers: [
        { provide: UserDataService, useValue: userDataServiceMock },
        { provide: MatBottomSheet, useValue: matBottomSheetMock },
        { provide: Router, useValue: routerMock },
        { provide: AngularFireAuth, useValue: afAuthMock },
      ],
    });
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the value of isLoggedIn from UserDataService', () => {
    const result = component.getIsLoggedIn();

    expect(result).toBe(true);
  });

  it('should return the value of userHasProfile from UserDataService', () => {
    const result = component.getUserHasProfile();

    expect(result).toBe(true);
  });

  it('should return the publicName from userInfo in UserDataService', () => {
    const result = component.getUserName();

    expect(result).toBe('Vlad');
  });

  it('should open the login sheet when login is clicked', () => {
    component.onLoginClick();

    expect(matBottomSheetMock.open).toHaveBeenCalled();
  });

  it('should navigate to home and call necessary methods when logout is clicked', () => {
    component.onLogoutClick();

    expect(routerMock.navigate).toHaveBeenCalledWith(['']);
    expect(userDataServiceMock.resetUserName).toHaveBeenCalled();
    expect(afAuthMock.signOut).toHaveBeenCalled();
  });
});
