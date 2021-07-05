import { IProduct } from './../../services/product.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICartServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import {
  ProductService,
  IProductsResponse,
} from 'src/app/services/product.service';
import { IUser } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  cartInfo: ICartServer;
  cartTotal: number;
  products: IProduct[];
  selectedCategory: string;
  @Input('authState') authState: boolean;
  @Input() user: IUser;

  constructor(
    public cartService: CartService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService
      .getProducts()
      .subscribe(
        (prodData: IProductsResponse) => (this.products = prodData.products)
      );

    this.cartService.cartTotal$.subscribe(
      (cTotal) => (this.cartTotal = cTotal)
    );

    this.cartService.cartInfo$.subscribe((cInfo) => (this.cartInfo = cInfo));
  }

  public goDashboard() {
    if (this.authState) {
      if (this.user?.role === 'admin' || this.user?.role === 'superAdmin') {
        this.router.navigateByUrl('/admin/dashboard');
      } else {
        alert(
          'To access Dashboard panel, you must be an Admin or Super Admin!'
        );
      }
    }
  }

  public searchCat() {
    this.router.navigate(['/products/category', this.selectedCategory]).then();
  }

  public selectedCat(category: string) {
    console.log(category);
    this.selectedCategory = category;
  }
}
