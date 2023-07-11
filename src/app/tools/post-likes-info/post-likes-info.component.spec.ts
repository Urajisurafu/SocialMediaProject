import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostLikesInfoComponent } from './post-likes-info.component';

describe('PostLikesInfoComponent', () => {
  let component: PostLikesInfoComponent;
  let fixture: ComponentFixture<PostLikesInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostLikesInfoComponent]
    });
    fixture = TestBed.createComponent(PostLikesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
