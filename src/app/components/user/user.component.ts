import { IOrder, IOrderResponse, IOrdersResponse } from './../../services/order.service';
import { SocialUser, SocialAuthService } from 'angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { IUser, IUserResponse, UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { OrderService } from 'src/app/services/order.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  myUser: IUser;
  userOrderData: IOrder[];

  constructor(
    private authService: SocialAuthService,
    private userService: UserService,
    private router: Router,
    private orderService: OrderService
  ) {}

  userOrderData$ = new BehaviorSubject<IOrder[]>(null);

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
      console.log(this.userOrderData);
    });

    console.log(this.myUser)
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
          console.log(total);
        });
      });
      return total;
    } else return total;
  }
}
