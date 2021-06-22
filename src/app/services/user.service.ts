import jwt_decode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
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
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private SERVER_URL = environment.SERVER_URL;

  authState$ = new BehaviorSubject<boolean>(this.checkLoginStatus());
  userData$ = new BehaviorSubject<SocialUser | IUser>(
    JSON.parse(localStorage.getItem('userData'))
  );

  constructor(
    private authService: SocialAuthService,
    private http: HttpClient,
    private cookies: CookieService,
    private router: Router
  ) {
    authService.authState.subscribe((user: SocialUser | IUser) => {
      // console.log('Social User=====================', user);
      if (user != null) {
        this.authState$.next(true);
        this.userData$.next(user);
      }
    });
    this.userData$.subscribe((data) => console.log(data));
  }

  // Register user with name, email and password
  registerUser(userFormData: IUserInput): Observable<IUserResponse> {
    const { name, email, password, confirmPassword } = userFormData;
    // console.log(userFormData);
    return this.http.post<IUserResponse>(
      `${this.SERVER_URL}/users/create`,
      userFormData
    );
  }

  //  Login User with Email and Password
  loginUser(email: string, password: string) {
    this.http
      .post(`${this.SERVER_URL}/users/login`, { email, password })
      .subscribe((data: IUserResponse) => {
        if (data.success) {
          this.authState$.next(true);
          this.userData$.next(data.user);

          const jwt: string = this.cookies.get('auth');
          localStorage.setItem('jwt', jwt);
          localStorage.setItem('loginStatus', '1');
          localStorage.setItem('userData', JSON.stringify(data.user));
        }
      });
    // console.log(this.authState$);
    // console.log(this.userData$);
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
      .post<ILogoutResponse>(`${this.SERVER_URL}/users/logout`, {})
      .subscribe((data: ILogoutResponse) => {
        // console.log(data);
        if (data.success) {
          // Update authState observable
          this.authState$.next(false);
          this.userData$.next(null);

          // Remove saved jwt cookie from local
          localStorage.removeItem('jwt');
          localStorage.setItem('loginStatus', '0');
          localStorage.removeItem('userData');

          this.router.navigateByUrl('/users/login');
        }
      });
    // console.log(this.authState$);
  }

  getAllUsers() {
    return this.http
      .get<IUsersResponse>(this.SERVER_URL + '/users')
      .toPromise();
  }

  deleteUser(userId: string) {
    return this.http
      .delete<IUserResponse>(this.SERVER_URL + `/users/delete/${userId}`)
      .toPromise();
  }

  updateUser(userId: string, userInfo: IUserInput) {
    return this.http
      .put<IUserResponse>(this.SERVER_URL + `/users/update/${userId}`, userInfo)
      .toPromise();
  }

  updateLoggedInUser(userInfo: ILoggedInUserInput) {
    return this.http
      .put<IUserResponse>(this.SERVER_URL + `/users/update/me`, userInfo)
      .toPromise();
  }

  checkLoginStatus(): boolean {
    const loginCookie = localStorage.getItem('loginStatus');

    if (loginCookie === '1') {
      if (
        localStorage.getItem('jwt') === null ||
        localStorage.getItem('jwt') === undefined
      ) {
        return false;
      }

      // Get and Decode the Token
      const token = localStorage.getItem('jwt');
      const decoded: IDecodedToken = jwt_decode(token);

      // Check if the cookie is valid
      if (decoded.exp === undefined) {
        return false;
      }

      // Get Current Date Time
      const date = new Date(0);

      // Convert EXp Time to UTC
      let tokenExpDate = date.setUTCSeconds(decoded.exp);

      // If Value of Token time greater than
      if (tokenExpDate.valueOf() > new Date().valueOf()) {
        return true;
      }

      // console.log('NEW DATE ' + new Date().valueOf());
      // console.log('Token DATE ' + tokenExpDate.valueOf());

      return false;
    }
    return false;
  }

  get isLoggedIn() {
    return this.authState$.asObservable();
  }
}

export interface IUser {
  _id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}
export interface IUserResponse {
  user: IUser;
  success: {
    title: string;
    message: string;
  };
}

export interface IUsersResponse {
  users: IUser[];
  success: {
    title: string;
    message: string;
  };
}

export interface ILogoutResponse {
  success: {
    title: string;
    message: string;
  };
}

export interface IUserInput {
  name: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
}
export interface ILoggedInUserInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IDecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}
