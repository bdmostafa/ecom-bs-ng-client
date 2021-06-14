import { IRegisterUserResponse } from './../services/user.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanActivateChild {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log(state.url);

    if (this.userService.auth) {
      return true;
    }

    this.router.navigate(['/users/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      
      // TODO admin guard for child components 
    if (this.userService.auth) {
     
    }
    this.userService.userData$.subscribe((user: IUserResponse) => {
      console.log(user, childRoute, state);
      if (user?.role === 'admin' || user?.role === 'superAdmin') {
        console.log("admin in guard")
        return true;
      }
    });
    this.router.navigate(['/users/login'], {
      queryParams: { returnUrl: state.url },
    });
    console.log('admin guard fails ========')
    return false;
    
  }
}

export interface IUserResponse {
  role: string;
  name: string;
  email: string;
  msg: string;
}
