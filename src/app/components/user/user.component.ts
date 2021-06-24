import { ILoggedInUserInput } from './../../services/user.service';
import { IOrder, IOrderResponse, IOrdersResponse } from './../../services/order.service';
import { SocialUser, SocialAuthService } from 'angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { IUser, IUserInput, IUserResponse, UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { OrderService } from 'src/app/services/order.service';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forbiddenPassValidator, matchPasswordValidator } from 'src/app/validators/password.validator';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  myUser: IUser;
  userOrderData: IOrder[];
  userForm: FormGroup;
  user: any;

  constructor(
    private authService: SocialAuthService,
    private userService: UserService,
    private router: Router,
    private orderService: OrderService,
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

  userOrderData$ = new BehaviorSubject<IOrder[]>(null);

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
      .subscribe((data: IUser) => {
        this.myUser = data;
      });

    // Load user orders if he/she has any orders
    this.orderService.getMyOrders().then((ordersData: IOrdersResponse) => {
      // console.log(ordersData.orders);
      this.userOrderData$.next(ordersData.orders);
      this.userOrderData = ordersData.orders;
      // console.log(this.userOrderData);
    });

    console.log(this.myUser)

    // patchValue is used for auto-fill data in the update user form 
    this.userForm.patchValue(this.myUser)
  }

  updateUser() {
    if (this.userForm.invalid) {
      return;
    }

    let formData: ILoggedInUserInput;

    formData = {
      name: this.name.value,
      email: this.email.value,
      password: this.password.value,
      confirmPassword: this.confirmPassword.value,
    };

    console.log(formData);
    this.userService
      .updateLoggedInUser(formData)
      .then((data: IUserResponse) => {
        if (data.success) window.location.reload();
      });

    this.userForm.reset();
  }

  logout() {
    this.userService.logout();
  }

  // Calculate total price of loggedInUser orders
  calculateTotal() {
    let total: number = 0;
    if (this.userOrderData?.length > 0) {
      this.userOrderData.forEach((orders) => {
        orders.productOrdered.forEach((products: any) => {
          const subTotal: number = products?.product?.price * products?.quantity;
          total = Number(total + subTotal);
          // console.log(total);
        });
      });
      return total;
    } else return total;
  }
}
