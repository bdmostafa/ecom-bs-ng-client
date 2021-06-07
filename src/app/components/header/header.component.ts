import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICartServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  cartInfo: ICartServer;
  cartTotal: number;
  products;
  selectedCategory: string;
  authState: boolean;

  constructor(
    public cartService: CartService,
    private productService: ProductService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.productService
      .getProducts()
      .subscribe((products) => (this.products = products));

    this.userService.authState$.subscribe((auth) => (this.authState = auth));

    this.cartService.cartTotal$.subscribe(
      (cTotal) => (this.cartTotal = cTotal)
    );

    this.cartService.cartInfo$.subscribe((cInfo) => (this.cartInfo = cInfo));
  }

  selectCategory(category: String) {
    this.router.navigate(['/products/category', category]).then();
  }

  selectedCat() {
    console.log(this.selectedCategory);
  }
}
