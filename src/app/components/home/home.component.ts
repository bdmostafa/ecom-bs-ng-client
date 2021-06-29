import { CartService } from './../../services/cart.service';
import {
  IProductsResponse,
  ProductService,
} from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/models/product.model';
import _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: IProduct[] = [];
  isCategory: boolean = false;
  isHome: boolean = true;

  ascProducts: IProduct[];

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit(): void {
    this.productService
      .getProducts()
      .subscribe((prodData: IProductsResponse) => {
        this.ascProducts = prodData.products;

        this.products = _.shuffle(prodData.products);

        console.log('products==', this.products);

        // Sort products by price in ascending order:
        this.ascProducts?.length &&
          this.ascProducts.sort((a, b) => a.price - b.price);
      });
  }

  selectCategory(e: boolean) {
    this.isCategory = e;
  }

  selectHome(e: boolean) {
    this.isHome = e;
  }

  addToCart(id: string) {
    this.cartService.addToCart(id);
  }

  notifyEmpty(product: string) {
    alert(
      `Oops! The product ${product} is out of stock now. Please stay updated with us.`
    );
  }
}
