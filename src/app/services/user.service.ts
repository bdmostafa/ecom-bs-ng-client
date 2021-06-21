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

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private SERVER_URL = environment.SERVER_URL;
  private user;

  authState$ = new BehaviorSubject<boolean>(this.checkLoginStatus());
  userData$ = new BehaviorSubject<SocialUser | ILoginUserResponse>(
    JSON.parse(localStorage.getItem('userData'))
  );

  constructor(
    private authService: SocialAuthService,
    private http: HttpClient,
    private toastr: ToastrService,
    private cookies: CookieService
  ) {
    authService.authState.subscribe((user: SocialUser | ILoginUserResponse) => {
      console.log('Social User=====================', user);
      if (user != null) {
        this.authState$.next(true);
        this.userData$.next(user);
      }
    });
    this.userData$.subscribe((data) => console.log(data));
  }

  // Register user with name, email and password
  registerUser(formData: ILoginUser): Observable<IRegisterUserResponse> {
    const { name, email, password, confirmPassword } = formData;
    console.log(formData);
    return this.http.post<IRegisterUserResponse>(
      `${this.SERVER_URL}/users/create`,
      {
        name,
        email,
        password,
        confirmPassword,
      }
    );
  }

  //  Login User with Email and Password
  loginUser(email: string, password: string) {
    this.http
      .post(`${this.SERVER_URL}/users/login`, { email, password })
      .subscribe((data: ILoginUserResponse) => {
        if (data.success) {
          this.authState$.next(true);
          this.userData$.next(data);

          const jwt: string = this.cookies.get('auth');
          localStorage.setItem('jwt', jwt);
          localStorage.setItem('loginStatus', '1');
          localStorage.setItem('userData', JSON.stringify(data));
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
        console.log(data);
        if (data.success) {
          // Update authState observable
          this.authState$.next(false);
          this.userData$.next(null);

          // Remove saved jwt cookie from local
          localStorage.removeItem('jwt');
          localStorage.setItem('loginStatus', '0');
          localStorage.removeItem('userData');
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

      console.log('NEW DATE ' + new Date().valueOf());
      console.log('Token DATE ' + tokenExpDate.valueOf());

      return false;
    }
    return false;
  }

  get isLoggedIn() {
    return this.authState$.asObservable();
  }
}

export interface ILoginUserResponse {
  email: string;
  success: {
    title: string;
    message: string;
  };
  name: string;
  role: string;
}
export interface IRegisterUserResponse {
  email: string;
  name: string;
  role: string;
  success: {
    title: string;
    message: string;
  };
}
export interface IUserResponse {
  _id: string;
  createdAt: string;
  email: string;
  name: string;
  role: string;
}

export interface IUsersResponse {
  users: IUserResponse[];
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

export interface ILoginUser {
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
