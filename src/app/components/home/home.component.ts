import { Router } from '@angular/router';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: any[] = [];

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((product: {count: Number, products: any[]}) => {
      // console.log(product.products)
      this.products.push(product);
      console.log(this.products)
    });
  }

  selectProduct(id: String) {
    this.router.navigate(['/products', id]).then();
  }

}
