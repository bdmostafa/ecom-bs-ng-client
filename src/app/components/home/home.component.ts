import { ServerResponse } from './../../models/product.model';
import { Router } from '@angular/router';
import { IProductsResponse, ProductService } from './../../services/product.service';
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

  constructor(
    private productService: ProductService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((prodData: IProductsResponse) => {
      this.products = prodData.products;
      console.log(this.products);
    });
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
