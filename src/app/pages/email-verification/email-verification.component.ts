import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
})
export class EmailVerificationComponent {
  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.authState.subscribe((user) => {
      if (user?.emailVerified) {
        this.router.navigate(['']);
      }
    });
  }
  onResendClick() {
    this.afAuth.currentUser.then((u) => {
      u?.sendEmailVerification();
    });
  }

  onRefreshClick() {
    window.location.reload();
  }
}
