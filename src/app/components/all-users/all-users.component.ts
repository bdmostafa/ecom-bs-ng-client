import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IUser,
  IUserInput,
  IUserResponse,
  IUsersResponse,
  UserService,
} from 'src/app/services/user.service';
import {
  forbiddenPassValidator,
  matchPasswordValidator,
} from 'src/app/validators/password.validator';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css'],
})
export class AllUsersComponent implements OnInit {
  users: IUser[];
  userForm: FormGroup;
  user: any;
  roleList = ['user', 'admin', 'superAdmin'];

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.userForm = fb.group(
      {
        _id: ['', [Validators.required]],
        name: ['', [Validators.required, Validators.minLength(4)]],
        email: ['', [Validators.required, Validators.email]],
        role: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            forbiddenPassValidator(/^password$/i),
            Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$'),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      // perform the validation in a common ancestor control: the FormGroup
      { validator: matchPasswordValidator }
    );
  }

  get _id() {
    return this.userForm.get('_id');
  }

  get name() {
    return this.userForm.get('name');
  }

  get email() {
    return this.userForm.get('email');
  }

  get role() {
    return this.userForm.get('role');
  }

  get password() {
    return this.userForm.get('password');
  }
  get confirmPassword() {
    return this.userForm.get('confirmPassword');
  }

  ngOnInit(): void {
    // Load all users from backend
    this.userService.getAllUsers().then((usersData: IUsersResponse) => {
      console.log(usersData.users);
      this.users = usersData.users;
    });
  }

  deleteUser(userId: string) {
    this.userService.deleteUser(userId).then((user: IUserResponse) => {
      if (user.success) {
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate(['/admin/all-users']);
          });
      }
    });
  }

  processUserInfo(user) {
    this.user = this.userForm.patchValue(user);
  }

  updateUser() {
    if (this.userForm.invalid) {
      return;
    }

    let formData: IUserInput;

    formData = {
      name: this.name.value,
      email: this.email.value,
      role: this.role.value,
      password: this.password.value,
      confirmPassword: this.confirmPassword.value,
    };

    console.log(formData);
    this.userService
      .updateUser(this._id.value, formData)
      .then((data: IUserResponse) => {
        if (data.success) window.location.reload();
      });

    this.userForm.reset();
  }
}
