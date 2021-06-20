import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IProductsResponse, ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-generate-product',
  templateUrl: './generate-product.component.html',
  styleUrls: ['./generate-product.component.css'],
})
export class GenerateProductComponent implements OnInit {
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {}

  generateProducts() {
    this.productService.generateProductsByThirdParty().subscribe(
      (prodData: IProductsResponse) => {
        if (prodData.products.length > 0) {
          // console.log(prodData.products)
        }
      }
    );
  }
}
