import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { PostData } from '../../interfaces/post-data.interface';

@Component({
  selector: 'app-post-window',
  templateUrl: './post-window.component.html',
  styleUrls: ['./post-window.component.scss'],
})
export class PostWindowComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public postData: PostData) {}
}
