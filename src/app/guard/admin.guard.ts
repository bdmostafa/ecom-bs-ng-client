import { ILoginUserResponse, IRegisterUserResponse } from './../services/user.service';
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
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanActivateChild {
  private isLoggedIn: boolean = false;
  user: ILoginUserResponse;

  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) {
    userService.isLoggedIn.subscribe(value => this.isLoggedIn = value);
    userService.userData$.subscribe((user: ILoginUserResponse) => {
      this.user = user;
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log(state.url);

    if (this.isLoggedIn) {
      return true;
    }

    this.router.navigate(['/users/login'], {
      queryParams: { returnUrl: state.url },
    });
    console.log('canActivate -> false ====');
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
    console.log(this.user, childRoute, state);

    if (this.isLoggedIn) {
      if (this.user?.role === 'admin' || this.user?.role === 'superAdmin') {
        console.log('canActivateChild -> true ====');
        return true;
      } else {
        // this.router.navigate(['/users/me']);
        this.router.navigate(['users/me']).then(() => {
          // TODO toastr does not works --- need to fix later
          // Warning notification with ToastrService
          this.toastr.warning(
            'Oops...! As an user you are not allowed to enter Dashboard. Please logout and again login as an Admin',
            'Dashboard Access Info',
            {
              closeButton: true,
              progressBar: true,
              positionClass: 'top-full-width',
              progressAnimation: 'increasing',
              timeOut: 3000
            }
          );
        });
        console.log('canActivateChild -> false ====');
        return false;
      }
    }
  }
}
