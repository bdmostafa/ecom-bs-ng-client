import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  private isLoggedIn: boolean = false;
  
  constructor(private userService: UserService, private router: Router) {
    userService.isLoggedIn.subscribe(value => this.isLoggedIn = value);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    
    this.userService.userData$.subscribe(user => console.log(user));

    if (this.isLoggedIn) {
      return true;
    }

    this.router.navigate(['/users/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
