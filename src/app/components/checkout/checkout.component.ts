import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ICartServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartInfo: ICartServer;
  cartTotal: number;

  constructor(
    private spinner: NgxSpinnerService,
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.cartService.cartInfo$.subscribe(cInfo => this.cartInfo = cInfo );
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
  }

  processCheckout() {
    this.spinner.show().then(c => {
      // console.log(c)
      this.cartService.checkoutFromCart('1');
    });
  }

}
