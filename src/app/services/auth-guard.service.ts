import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserDataService } from './user-data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private router: Router,
    private userDataService: UserDataService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const requestedRoute = state.url;

    if (requestedRoute === '/postFeed') {
      if (
        this.userDataService.userHasProfile &&
        this.userDataService.isLoggedIn
      ) {
        return true;
      } else {
        this.router.navigate(['']);
        return false;
      }
    } else {
      return true;
    }
  }
}
