import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
  userData$ = new BehaviorSubject<SocialUser | ILoginUserResponse>(null);

  constructor(
    private authService: SocialAuthService,
    private http: HttpClient,
    private toastr: ToastrService,
  ) {
    authService.authState.subscribe((user: SocialUser | ILoginUserResponse) => {
      console.log("=====================", user)
      if (user != null) {
        this.auth = true;
        this.authState$.next(this.auth);
        this.userData$.next(user);
      }
    });
  }

  // Register user with name, email and password
  registerUser(formData: ILoginUser): Observable<IRegisterUserResponse> {
    const { name, email, password, confirmPassword } = formData;
    console.log(formData);
    return this.http.post<IRegisterUserResponse>(`${this.SERVER_URL}/users/create`, {
      name,
      email,
      password,
      confirmPassword
    });
  }

  //  Login User with Email and Password
  loginUser(email: string, password: string) {
    this.http
      .post(`${this.SERVER_URL}/users/login`, { email, password }, {withCredentials: true})
      .subscribe((data: ILoginUserResponse) => {
        if (data.msg === 'Successfully LoggedIn') {
          this.auth = true;
        }
        this.authState$.next(this.auth);
        this.userData$.next(data);

         // Success notification with ToastrService
         this.toastr.success(
          "You have logged in Successfully",
          "Login Success",
          {
            progressBar: true,
            positionClass: 'toast-top-right',
            progressAnimation: 'increasing',
            timeOut: 3000,
          }
        );
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

  logout(): void {
    // TODO social login/logout
    // this.authService.signOut();
    this.http
      .post<ILogoutResponse>(`${this.SERVER_URL}/users/logout`, {}, {withCredentials: true})
      .subscribe((data: ILogoutResponse) => {
        console.log(data);
        if (data.msg) {
          // Update authState observable
          this.auth = false;
          this.authState$.next(this.auth);
  
           // Success notification with ToastrService
           this.toastr.success(
            "You have been logged out Successfully",
            "Logout Success",
            {
              progressBar: true,
              positionClass: 'toast-top-right',
              progressAnimation: 'increasing',
              timeOut: 3000,
            }
          );
        }        
      }, 
      (error) => {
        console.log(error)
        const statusText = error.statusText;
        // If error.error is array
        if (typeof error.error === 'object' && error.error instanceof Array) {
          error.error.forEach((element) => {
            this.toastr.error(element.msg, statusText, {
              progressBar: true,
              positionClass: 'toast-top-right',
              progressAnimation: 'increasing',
              timeOut: 3000,
            });
          });
        } else {
          // When error.error is not an array
          this.toastr.error(error.error, error.statusText, {
            progressBar: true,
            positionClass: 'toast-top-right',
            progressAnimation: 'increasing',
            timeOut: 3000,
          });
        }
      }
      );
      console.log(this.authState$)  
  }

  getAllUsers() {
    return this.http
      .get<IUsersResponse[]>(this.SERVER_URL + '/users', {withCredentials: true})
      .toPromise();
  }

  deleteUser(userId: string) {
    return this.http
      .delete<IUsersResponse>(this.SERVER_URL + `/users/delete/${userId}`, {withCredentials: true} )
      .toPromise();
  }
}

export interface ILoginUserResponse {
  email: string;
  msg: string;
  name: string;
  role: string;
}
export interface IRegisterUserResponse {
  email: string;
  name: string;
  role: string;
}
export interface IUsersResponse {
  _id: string;
  createdAt: string;
  email: string;
  name: string;
  role: string;
}


export interface ILogoutResponse {
  msg: string;
}

export interface ILoginUser {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}