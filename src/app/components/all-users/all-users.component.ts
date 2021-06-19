import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUserResponse, IUsersResponse, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css'],
})
export class AllUsersComponent implements OnInit {
  users: IUserResponse[];

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load all users from backend
    this.userService.getAllUsers().then(
      (usersData: IUsersResponse) => {
        console.log(usersData.users);
        this.users = usersData.users;
      }
    );
  }

  deleteUser(userId: string) {
    this.userService.deleteUser(userId).then(
      () => {
        this.router.navigateByUrl('admin/all-users');
      }
    );
  }
}
