import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainUserPageComponent } from './main-user-page.component';

describe('MainUserPageComponent', () => {
  let component: MainUserPageComponent;
  let fixture: ComponentFixture<MainUserPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainUserPageComponent]
    });
    fixture = TestBed.createComponent(MainUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
