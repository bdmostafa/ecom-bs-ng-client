import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
  FacebookLoginProvider,
} from 'angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  auth: boolean = false;
  private SERVER_URL = environment.SERVER_URL;
  private user;
  authState$ = new BehaviorSubject<boolean>(this.auth);
  userData$ = new BehaviorSubject<SocialUser | IUserResponse>(null);

  constructor(
    private authService: SocialAuthService,
    private http: HttpClient,
    private toastr: ToastrService,
  ) {
    authService.authState.subscribe((user: SocialUser) => {
      if (user != null) {
        this.auth = true;
        this.authState$.next(this.auth);
        this.userData$.next(user);
      }
    });
  }

  //  Login User with Email and Password
  loginUser(email: string, password: string) {
    this.http
      .post(`${this.SERVER_URL}/users/login`, { email, password })
      .subscribe((data: IUserResponse) => {
        if (data.msg === 'Successfully LoggedIn') {
          this.auth = true;
        }
        this.authState$.next(this.auth);
        this.userData$.next(data);
      }, (error) => {
        console.log(error)
         // Error handling with ToastrService
         this.toastr.error(
          error.error,
          error.statusText,
          {
            progressBar: true,
            positionClass: 'toast-top-right',
            progressAnimation: 'increasing',
            timeOut: 3000,
          }
        );
      });
      console.log(this.authState$)
  }

  //  Google Authentication
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  // FB Authentication
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  logout() {
    this.authService.signOut();
    this.auth = false;
    this.authState$.next(this.auth);
  }
}

export interface IUserResponse {
  // token: string;
  // auth: boolean;
  email: string;
  msg: string;
  name: string;
  role: string;
  // photoUrl: string;
  // userId: string;
}
