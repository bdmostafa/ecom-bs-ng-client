import { SocialAuthService } from 'angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user = new User();

  constructor(
    private authService: SocialAuthService,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userService.authState$.subscribe((authState) => {
      console.log(this.userService.authState$, this.route);
      if (authState) {
        this.router.navigateByUrl(
          this.route.snapshot.queryParams['returnUrl'] || '/users/me'
        );
      } else {
        this.router.navigateByUrl('/users/login');
      }
    });
  }

  signInWithGoogle() {
    this.userService.signInWithGoogle();
  }

  processLogin(form: NgForm) {
    console.log(form)
    const email = this.user.email;
    const password = this.user.password;

    if (form.invalid) {
      return;
    }

    form.reset();
    this.userService.loginUser(email, password);
  }
}

export class User {
  public email: string;
  public password: string;
}