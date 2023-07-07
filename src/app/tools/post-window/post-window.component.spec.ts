import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostWindowComponent } from './post-window.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PostWindowComponent', () => {
  let component: PostWindowComponent;
  let fixture: ComponentFixture<PostWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostWindowComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(PostWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
