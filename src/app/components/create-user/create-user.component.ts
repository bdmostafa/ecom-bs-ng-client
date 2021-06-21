import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IUserResponse,
  UserService,
} from 'src/app/services/user.service';
import {
  forbiddenPassValidator,
  matchPasswordValidator,
} from 'src/app/validators/password.validator';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class CreateUserComponent implements OnInit {
  userForm: FormGroup;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.userForm = fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(4)]],
        email: ['', [Validators.required, Validators.email]],
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

  get name() {
    return this.userForm.get('name');
  }
  get email() {
    return this.userForm.get('email');
  }

  get password() {
    return this.userForm.get('password');
  }
  get confirmPassword() {
    return this.userForm.get('confirmPassword');
  }

  ngOnInit(): void {}

  createUser() {
    console.log(this.userForm);
    if (this.userForm.invalid) {
      return;
    }

    this.userService
      .registerUser({ ...this.userForm.value })
      .subscribe((response: IUserResponse) => {
        console.log(response);

        this.router.navigateByUrl('/admin/all-users');
      });

    this.userForm.reset();
  }
}
