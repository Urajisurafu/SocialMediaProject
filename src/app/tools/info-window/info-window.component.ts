import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-window',
  templateUrl: './info-window.component.html',
  styleUrls: ['./info-window.component.scss'],
})
export class InfoWindowComponent {
  @Input() content?: string;
}
