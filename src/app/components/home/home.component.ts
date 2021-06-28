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

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService
      .getProducts()
      .subscribe((prodData: IProductsResponse) => {
        this.products = _.shuffle(prodData.products);
        console.log(this.products);
      });
  }

  selectCategory(e) {
    this.isCategory = e;
  }

  selectHome(e) {
    this.isHome = e;
  }
}
