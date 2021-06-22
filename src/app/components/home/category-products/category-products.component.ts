import { IProduct } from './../../../models/product.model';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-category-products',
  templateUrl: './category-products.component.html',
  styleUrls: ['./category-products.component.css'],
})
export class CategoryProductsComponent implements OnInit {
  @Input() products: IProduct[];
  categorizedProducts = {};

  constructor(private router: Router, private cartService: CartService) {}

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

  selectProduct(id: String) {
    this.router.navigate(['/products', id]).then();
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
