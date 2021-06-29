import { IProduct } from './../../../models/product.model';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-category-products',
  templateUrl: './category-products.component.html',
  styleUrls: ['./category-products.component.css'],
})
export class CategoryProductsComponent implements OnInit {
  @Input() products: IProduct[];
  @Output() addToCartEvent: EventEmitter<string> = new EventEmitter();
  @Output() notifyEmptyEvent: EventEmitter<string> = new EventEmitter();

  categorizedProducts = {};

  constructor() {}

  ngOnInit(): void {
    this.products.forEach((p) => {
      if (!this.categorizedProducts || !this.categorizedProducts[p.category]) {
        this.categorizedProducts[p.category] = [p];
      } else {
        this.categorizedProducts[p.category].push(p);
      }
    });

    this.categorizedProducts = Object.keys(this.categorizedProducts).map(
      (key) => this.categorizedProducts[key]
    );
    console.log(this.categorizedProducts);
  }

  addToCart(id: string) {
    this.addToCartEvent.emit(id);
  }

  notifyEmpty(product: string) {
    this.notifyEmptyEvent.emit(product);
  }
}
