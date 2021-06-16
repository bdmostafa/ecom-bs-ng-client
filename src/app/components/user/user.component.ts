import { IOrderResponse } from './../../services/order.service';
import { SocialUser, SocialAuthService } from 'angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { ILoginUserResponse, UserService } from 'src/app/services/user.service';
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
  myUser: any;
  userOrderData: IOrderResponse[];

  constructor(
    private authService: SocialAuthService,
    private userService: UserService,
    private router: Router,
    private orderService: OrderService
  ) {}

  userOrderData$ = new BehaviorSubject<IOrderResponse[]>(null);

  ngOnInit(): void {
    this.userService.userData$
      .pipe(
        map((user: SocialUser | ILoginUserResponse) => {
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
      .subscribe((data: ILoginUserResponse | SocialUser) => {
        this.myUser = data;
      });

    // Load user orders if he/she has any orders
    this.orderService.getMyOrders().then((orders: IOrderResponse[]) => {
      console.log(orders);
      this.userOrderData$.next(orders);
      this.userOrderData = orders;
    });
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
          const subTotal = products.product.price * products.quantity;
          total = total + subTotal;
        });
      });
      return total;
    } else return total;
  }
}
