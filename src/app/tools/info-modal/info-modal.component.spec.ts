import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InfoModalComponent } from './info-modal.component';
import { MaterialModule } from '../../modules/material/material.module';

describe('InfoModalComponent', () => {
  let component: InfoModalComponent;
  let fixture: ComponentFixture<InfoModalComponent>;
  let matDialogRefMock: Partial<MatDialogRef<InfoModalComponent>>;

  beforeEach(async () => {
    matDialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [InfoModalComponent],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { message: 'Test Message' } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call dialog.close(true) on buttonClick()', () => {
    component.buttonClick();
    expect(matDialogRefMock.close).toHaveBeenCalledWith(true);
  });

  it('should call dialog.close() on closeClick()', () => {
    component.closeClick();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });
});
