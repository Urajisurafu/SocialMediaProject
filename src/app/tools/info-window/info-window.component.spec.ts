import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoWindowComponent } from './info-window.component';

describe('InfoWindowComponent', () => {
  let component: InfoWindowComponent;
  let fixture: ComponentFixture<InfoWindowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoWindowComponent]
    });
    fixture = TestBed.createComponent(InfoWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
