import { Component, OnInit } from '@angular/core';
import { ICartServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cartInfo: ICartServer;
  cartTotal: number;

  constructor(public cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(cTotal => this.cartTotal = cTotal);

    this.cartService.cartInfo$.subscribe(cInfo => this.cartInfo = cInfo);
  }

}
