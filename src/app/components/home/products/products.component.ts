import { IProduct } from './../../../models/product.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
// import * as EventEmitter from 'events';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  @Input() products: IProduct[];
  @Output() addToCartEvent: EventEmitter<string> = new EventEmitter();
  @Output() notifyEmptyEvent: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  addToCart(id: string) {
    this.addToCartEvent.emit(id)
  }

  notifyEmpty(product: string) {
    this.notifyEmptyEvent.emit(product)
  }
}
