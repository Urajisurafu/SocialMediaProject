import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AngularFireAuth } from '@angular/fire/compat/auth';

import { fieldsMatchValidator } from '../../validators/match-fields.validator';

import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { InfoModalComponent } from '../info-modal/info-modal.component';

export enum AuthenticatorComponentState {
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD,
}

export enum AuthenticatorComponentClick {
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD,
}

@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.scss'],
})
export class AuthenticatorComponent {
  state = AuthenticatorComponentState.LOGIN;
  submitState!: AuthenticatorComponentClick;
  authenticatorForm: FormGroup;
  minLength: number = 3;

  constructor(
    private bottomSheetRef: MatBottomSheetRef,
    private afAuth: AngularFireAuth,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.authenticatorForm = new FormGroup({
      login: new FormGroup({
        loginEmail: new FormControl('', [
          Validators.required,
          Validators.email,
        ]),
        loginPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(this.minLength),
        ]),
      }),
      register: new FormGroup(
        {
          registerEmail: new FormControl('', [
            Validators.required,
            Validators.email,
          ]),
          registerPassword: new FormControl('', [
            Validators.required,
            Validators.minLength(this.minLength),
          ]),
          registerConfirmPassword: new FormControl('', [
            Validators.required,
            Validators.minLength(this.minLength),
          ]),
        },
        {
          validators: fieldsMatchValidator(
            'registerPassword',
            'registerConfirmPassword'
          ),
        }
      ),
      forgot: new FormGroup({
        resetEmail: new FormControl('', [
          Validators.required,
          Validators.email,
        ]),
      }),
    });
  }

  submitForm(event: Event) {
    event.preventDefault();

    switch (this.submitState) {
      case AuthenticatorComponentClick.LOGIN:
        this.setLogin();
        break;
      case AuthenticatorComponentClick.REGISTER:
        this.setRegister();
        break;
      case AuthenticatorComponentClick.FORGOT_PASSWORD:
        this.setReset();
        break;
      default:
        break;
    }
  }

  setRegister() {
    const email = this.authenticatorForm.get('register.registerEmail');
    const password = this.authenticatorForm.get('register.registerPassword');
    const confirmPassword = this.authenticatorForm.get(
      'register.registerConfirmPassword'
    );
    const register = this.authenticatorForm.get('register');

    if (
      email &&
      password &&
      confirmPassword &&
      !email.errors &&
      !password.errors &&
      !confirmPassword.errors &&
      !register?.errors
    ) {
      this.afAuth
        .createUserWithEmailAndPassword(email.value, password.value)
        .then(() => {
          this.router.navigate(['emailVerification']);
          this.bottomSheetRef.dismiss();
        })
        .catch((error) => {
          this.dialog.open(InfoModalComponent, {
            data: {
              info: 'Account with this email already exists',
              message: error.message,
            },
          });
        });
    }
  }

  onRegisterSubmitClick() {
    this.authenticatorForm.get('register.registerEmail')?.markAsTouched();
    this.authenticatorForm.get('register.registerPassword')?.markAsTouched();
    this.authenticatorForm
      .get('register.registerConfirmPassword')
      ?.markAsTouched();

    this.submitState = AuthenticatorComponentClick.REGISTER;
  }

  setLogin() {
    const email = this.authenticatorForm.get('login.loginEmail');
    const password = this.authenticatorForm.get('login.loginPassword');

    if (email && password && !email.errors && !password.errors) {
      this.afAuth
        .signInWithEmailAndPassword(email.value, password.value)
        .then(() => {
          this.bottomSheetRef.dismiss();
        })
        .catch((error) => {
          this.dialog.open(InfoModalComponent, {
            data: {
              info: 'Invalid E-mail or password',
              message: error.message,
            },
          });
        });
    }
  }

  onLoginSubmitClick() {
    this.authenticatorForm.get('login.loginEmail')?.markAsTouched();
    this.authenticatorForm.get('login.loginPassword')?.markAsTouched();
    this.submitState = AuthenticatorComponentClick.LOGIN;
  }

  setReset() {
    const email = this.authenticatorForm.get('forgot.resetEmail');

    if (email && !email.errors) {
      this.afAuth
        .sendPasswordResetEmail(email.value)
        .then(() => {
          this.bottomSheetRef.dismiss();
          this.dialog.open(InfoModalComponent, {
            data: {
              info: 'Check your E-mail',
              message:
                'A link to change your password has been sent to your email.',
            },
          });
        })
        .catch(() => {
          this.dialog.open(InfoModalComponent, {
            data: {
              info: 'Invalid E-mail',
              message: 'The email address is badly formatted.',
            },
          });
        });
    }
  }

  onResetClick() {
    this.authenticatorForm.get('forgot.resetEmail')?.markAsTouched();
    this.submitState = AuthenticatorComponentClick.FORGOT_PASSWORD;
  }

  onForgotPasswordButton() {
    this.state = AuthenticatorComponentState.FORGOT_PASSWORD;
  }

  onCreateAccountButton() {
    this.state = AuthenticatorComponentState.REGISTER;
  }

  onLoginButton() {
    this.state = AuthenticatorComponentState.LOGIN;
  }

  isLoginState() {
    return this.state == AuthenticatorComponentState.LOGIN;
  }

  isRegisterState() {
    return this.state == AuthenticatorComponentState.REGISTER;
  }

  isForgotPasswordState() {
    return this.state == AuthenticatorComponentState.FORGOT_PASSWORD;
  }

  getStateText() {
    switch (this.state) {
      case AuthenticatorComponentState.LOGIN:
        return 'Login';
      case AuthenticatorComponentState.REGISTER:
        return 'Register';
      case AuthenticatorComponentState.FORGOT_PASSWORD:
        return 'Forgot password';
    }
  }
}
