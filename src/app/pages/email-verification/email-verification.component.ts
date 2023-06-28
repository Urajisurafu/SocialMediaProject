import { Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
})
export class EmailVerificationComponent implements OnDestroy {
  private readonly authStateSubscription: Subscription | undefined;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.authStateSubscription = this.afAuth.authState.subscribe((user) => {
      if (user?.emailVerified) {
        this.router.navigate(['']);
      }
    });
  }

  ngOnDestroy() {
    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
    }
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
