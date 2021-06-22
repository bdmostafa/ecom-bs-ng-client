import { IProduct } from './../../../models/product.model';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  @Input() products: IProduct[];

  constructor(private router: Router,
    private cartService: CartService) { }

  ngOnInit(): void {
  }

  selectProduct(id: String) {
    this.router.navigate(['/products', id]).then();
  }

  addToCart(id: string) {
    this.cartService.addToCart(id);
  }

  notifyEmpty(product: string) {
    alert(`Oops! The product ${product} is out of stock now. Please stay updated with us.`)
  }
}
