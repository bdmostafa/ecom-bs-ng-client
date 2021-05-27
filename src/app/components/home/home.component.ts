import { ServerResponse } from './../../models/product.model';
import { Router } from '@angular/router';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { IProductServer } from 'src/app/models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: IProductServer[] = [];

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((product: IProductServer[]) => {
      console.log(product)
      this.products = product;
      console.log(this.products)
    });
  }

  selectProduct(id: String) {
    this.router.navigate(['/products', id]).then();
  }

}
