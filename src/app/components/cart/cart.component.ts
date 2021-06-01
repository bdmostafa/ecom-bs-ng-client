import { Component, OnInit } from '@angular/core';
import { ICartServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartInfo: ICartServer;
  cartTotal: number;
  subTotal: number;

  constructor(public cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cartInfo$.subscribe((data: ICartServer) => this.cartInfo = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
    console.log(this.cartInfo)
  }

  changeQty(idx: number, increase: boolean) {
    this.cartService.updateCart(idx, increase);
  }
}
