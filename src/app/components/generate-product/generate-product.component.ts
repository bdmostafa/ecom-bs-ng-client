import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  IProductsResponse,
  ProductService,
} from 'src/app/services/product.service';

@Component({
  selector: 'app-generate-product',
  templateUrl: './generate-product.component.html',
  styleUrls: ['./generate-product.component.css'],
})
export class GenerateProductComponent implements OnInit {
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {}

  generateProducts() {
    // Add spinner
    this.spinner.show().then((c) => {
      setTimeout(() => {
        this.productService
          .generateProductsByThirdParty()
          .subscribe((prodData: IProductsResponse) => {
            if (prodData.products.length > 0) {
              // console.log(prodData.products)
            }
          });

        // Hide spinner
        this.spinner.hide().then();
      }, 1000);
    });

    setTimeout(() => {
      // Hide spinner from here while API error response issue
      this.spinner.hide().then();
      this.router.navigateByUrl('/admin/dashboard');
    }, 1000);
  }
}
