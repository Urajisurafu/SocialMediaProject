import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MessageModalData } from '../../interfaces/message-modal-data.interface';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public message: MessageModalData) {}
}
