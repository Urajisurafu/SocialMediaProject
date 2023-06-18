import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MessageModalData } from '../../interfaces/message-modal-data.interface';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss'],
})
export class InfoModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public message: MessageModalData,
    private dialog: MatDialogRef<InfoModalComponent>
  ) {}

  buttonClick() {
    this.dialog.close(true);
  }

  closeClick() {
    this.dialog.close();
  }
}
