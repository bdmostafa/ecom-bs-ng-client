import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IUsersResponse, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {
  users: IUsersResponse[];

  constructor(private toastr: ToastrService, private userService: UserService) { }

  ngOnInit(): void {
    // Load all users from backend
    this.userService.getAllUsers().then(
      (users: IUsersResponse[]) => {
        console.log(users);
        this.users = users;

        // Success notification with ToastrService
        this.toastr.success('All users loaded successfully', 'All Users', {
          progressBar: true,
          positionClass: 'toast-top-right',
          progressAnimation: 'increasing',
          timeOut: 3000,
        });
      },
      // Error handling with ToastrService
      (error: any) => {
        console.log(error);
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
  }

}
