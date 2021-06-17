import { SocialUser } from 'angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { ILoginUserResponse, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css'],
})
export class HomeLayoutComponent implements OnInit {
  authStatus: boolean;
  user: ILoginUserResponse | SocialUser;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.isLoggedIn.subscribe((value) => {
      this.authStatus = value;
    });

    this.userService.userData$.subscribe((data) => {
      this.user = data;
    });

    console.log('auth', this.authStatus);
    console.log('user', this.user);
  }
}
