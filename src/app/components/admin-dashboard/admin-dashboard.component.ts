import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProduct } from 'src/app/models/product.model';
import { IProductResponse, IProductsResponse, ProductService } from 'src/app/services/product.service';

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
    this.productService.getProducts().subscribe((prodData: IProductsResponse) => {
      this.products = prodData.products;
      console.log(this.products);
    });
  }

  deleteProduct(productId: string) {
    this.productService.deleteProduct(productId).then(
      (data: IProductResponse) => {
        if (data.success) 
        this.router
        .navigateByUrl('/', { skipLocationChange: true })
        .then(() => {
          this.router.navigate(['/admin/dashboard']);
        });
      }
    );
  }
}
