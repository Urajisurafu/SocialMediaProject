import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationLikesComponent } from './information-likes.component';

describe('InformationLikesComponent', () => {
  let component: InformationLikesComponent;
  let fixture: ComponentFixture<InformationLikesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InformationLikesComponent]
    });
    fixture = TestBed.createComponent(InformationLikesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
