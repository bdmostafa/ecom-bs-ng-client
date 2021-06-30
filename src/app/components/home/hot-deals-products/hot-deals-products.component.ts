import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IProduct } from 'src/app/services/product.service';

@Component({
  selector: 'app-hot-deals-products',
  templateUrl: './hot-deals-products.component.html',
  styleUrls: ['./hot-deals-products.component.css']
})
export class HotDealsProductsComponent implements OnInit {
  @Input() products: IProduct[];
  @Output() addToCartEvent: EventEmitter<string> = new EventEmitter();
  @Output() notifyEmptyEvent: EventEmitter<string> = new EventEmitter();

  public hotDealsProducts: IProduct[];

  constructor() { }

  ngOnInit(): void {
    this.hotDealsProducts = this.products?.filter(item => item.price >= 100)
    console.log(this.hotDealsProducts)
  }

  public addToCart(id: string) {
    this.addToCartEvent.emit(id)
  }

  public notifyEmpty(product: string) {
    this.notifyEmptyEvent.emit(product)
  }
}
