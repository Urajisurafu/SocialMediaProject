import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostWindowComponent } from './post-window.component';

describe('PostWindowComponent', () => {
  let component: PostWindowComponent;
  let fixture: ComponentFixture<PostWindowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostWindowComponent]
    });
    fixture = TestBed.createComponent(PostWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
