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
  public products: IProduct[] = [];

  public isHome: boolean = true;
  public isCategory: boolean = false;
  public isHotDeals: boolean = false;
  public isContactUs: boolean = false;
  public isBlog: boolean = false;

  public ascProducts: IProduct[];

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

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

  // navigation menu changing from child component by Output() decorator
  public selectNav(value: string) {
    switch (value) {
      case 'home': {
        this.isHome = true;
        this.isCategory = false;
        this.isHotDeals = false;
        this.isContactUs = false;
        this.isBlog = false;
        break;
      }
      case 'category': {
        this.isCategory = true;
        this.isHome = false;
        this.isHotDeals = false;
        this.isContactUs = false;
        this.isBlog = false;
        break;
      }
      case 'hot-deals': {
        this.isHome = false;
        this.isCategory = false;
        this.isHotDeals = true;
        this.isContactUs = false;
        this.isBlog = false;
        break;
      }
      case 'contact-us': {
        this.isHome = false;
        this.isCategory = false;
        this.isHotDeals = false;
        this.isContactUs = true;
        this.isBlog = false;
        break;
      }
      case 'blog': {
        this.isHome = false;
        this.isCategory = false;
        this.isHotDeals = false;
        this.isContactUs = false;
        this.isBlog = true;
        break;
      }
      default: {
        this.isHome = true;
        this.isCategory = false;
        this.isHotDeals = false;
        this.isContactUs = false;
        this.isBlog = false;
        break;
      }
    }
  }

  public addToCart(id: string) {
    this.cartService.addToCart(id);
  }

  public notifyEmpty(product: string) {
    alert(
      `Oops! The product ${product} is out of stock now. Please stay updated with us.`
    );
  }
}
