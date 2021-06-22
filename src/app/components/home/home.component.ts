import { ServerResponse } from './../../models/product.model';
import { Router } from '@angular/router';
import {
  IProductsResponse,
  ProductService,
} from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: IProduct[] = [];
  isCategory: boolean = false;
  isProduct: boolean = true;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService
      .getProducts()
      .subscribe((prodData: IProductsResponse) => {
        this.products = prodData.products;
        console.log(this.products);
      });

      console.log(this.router.url)
  }

  selectCategory() {
    this.isCategory = true;
    this.isProduct = false;
  }

  selectHome() {
    this.isProduct = true;
    this.isCategory = false;
  }
}
