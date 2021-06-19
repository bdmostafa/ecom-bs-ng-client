import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { IRegisterUserResponse, UserService } from 'src/app/services/user.service';
import {
  forbiddenPassValidator,
  matchPasswordValidator,
} from 'src/app/validators/password.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registrationForm: FormGroup;
  comparePassword: boolean;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.registrationForm = fb.group(
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

  get formControls() {
    return this.registrationForm.controls;
  }

  get name() {
    return this.registrationForm.get('name');
  }
  get email() {
    return this.registrationForm.get('email');
  }

  get password() {
    return this.registrationForm.get('password');
  }
  get confirmPassword() {
    return this.registrationForm.get('confirmPassword');
  }

  ngOnInit(): void {
    this.registrationForm.valueChanges
      .pipe(
        map((controls) => {
          return this.confirmPassword.value === this.password.value;
        })
      )
      .subscribe((passwordState) => {
        console.log(passwordState);
        this.comparePassword = passwordState;
      });
    console.log(this.registrationForm);
  }

  registerUser() {
    console.log(this.registrationForm);
    if (this.registrationForm.invalid) {
      return;
    }

    // @ts-ignore
    this.userService.registerUser({ ...this.registrationForm.value }).subscribe(
      (response: IRegisterUserResponse) => {
        console.log(response);

        this.router.navigateByUrl('/users/login');
      }
    );

    this.registrationForm.reset();
  }
}
