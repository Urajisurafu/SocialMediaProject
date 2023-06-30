import { Component, Inject, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-information-likes',
  templateUrl: './information-likes.component.html',
  styleUrls: ['./information-likes.component.scss'],
})
export class InformationLikesComponent implements OnInit {
  private storageSubscription: Subscription | undefined;
  backgroundStorage: string = '';
  constructor(private storageService: StorageService) {}

  ngOnInit() {
    const storagePath = 'Background/likes-page.jpg';
    this.storageSubscription = this.storageService
      .getDataFromStorage(storagePath)
      .subscribe((data: any) => (this.backgroundStorage = `url(${data})`));
  }
}
