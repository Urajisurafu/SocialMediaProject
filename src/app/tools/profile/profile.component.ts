import { Component, Input } from '@angular/core';

import { UserDataService } from '../../services/user-data.service';

import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  @Input() show!: boolean;

  profileForm: FormGroup;

  constructor(private userDataService: UserDataService) {
    this.profileForm = new FormGroup({
      nickname: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  onContinueClick() {
    const nickname = this.profileForm.get('nickname');
    const description = this.profileForm.get('description');

    nickname?.markAsTouched();
    description?.markAsTouched();

    if (nickname && description && !nickname.errors && !description.errors) {
      this.userDataService.createUser(nickname.value, description.value);
      this.profileForm.reset();
    }
  }
}
