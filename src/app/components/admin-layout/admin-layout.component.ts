import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialUser } from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { IUser, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
})
export class AdminLayoutComponent implements OnInit {
  myUser: IUser;

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userService.userData$
      .pipe(
        map((user: SocialUser | IUser) => {
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
      .subscribe((data: IUser | SocialUser | any) => {
        console.log(data);
        if (data?.role === 'admin' || data?.role === 'superAdmin') {
          this.myUser = data;
          console.log('admin');
        } 
        // Although user role never come here because of adminGuard auth, 
        // it handles in else if block for severe security purpose
        else if (data?.role === 'user') {
          this.router.navigate(['users/me']).then(() => {
            // Info notification with ToastrService
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
            console.log('user');
          });
        } else if (data === null) {
          this.router.navigate(['/users/login']);
          console.log('not login data');
        }
      });
  }
}
