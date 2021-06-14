import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IRegisterUserResponse, UserService } from 'src/app/services/user.service';
import { forbiddenPassValidator, matchPasswordValidator } from 'src/app/validators/password.validator';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  userForm: FormGroup;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.userForm = fb.group({
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
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    },
    // perform the validation in a common ancestor control: the FormGroup
    { validator: matchPasswordValidator });
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

    // @ts-ignore
    this.userService.registerUser({ ...this.userForm.value }).subscribe(
      (response: IRegisterUserResponse) => {
        console.log(response);

        // Error handling with ToastrService
        this.toastr.success(
          'You have created a user successfully',
          'User Creation Success',
          {
            progressBar: true,
            positionClass: 'toast-top-right',
            progressAnimation: 'increasing',
            timeOut: 3000,
          }
        );

        this.router.navigateByUrl('/admin/all-users');
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

    this.userForm.reset();
  }
}
