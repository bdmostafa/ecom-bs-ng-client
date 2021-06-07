import { SocialUser, SocialAuthService } from 'angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { IUserResponse, UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  myUser: any;

  constructor(
    private authService: SocialAuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.userData$
      .pipe(
        map((user: SocialUser | IUserResponse) => {
          if (user instanceof SocialUser) {
            return {
              ...user,
              email: 'mostafa-user@gmm.com',
            };
          } else {
            return user;
          }
        })
      )
      .subscribe((data: IUserResponse | SocialUser) => {
        this.myUser = data;
      });
  }

  logout() {
    this.userService.logout();
  }
}
