import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProduct } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  products: IProduct[] = [];

  constructor(private productService: ProductService,
    private router: Router,) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((product: IProduct[]) => {
      this.products = product;
      console.log(this.products);
    });
  }

}
