import { IProductInput } from './../../../services/product.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IProduct,
  IProductResponse,
  IProductsResponse,
  ProductService,
} from 'src/app/services/product.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css'],
})
export class AllProductsComponent implements OnInit {
  products: IProduct[] = [];
  productForm: FormGroup;
  product;

  constructor(
    private productService: ProductService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.productForm = fb.group({
      _id: ['', [Validators.required]],
      title: ['', [Validators.required, Validators.minLength(4)]],
      price: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', [Validators.required, Validators.minLength(3)]],
      image: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
    });
  }

  get title() {
    return this.productForm.get('title');
  }

  get price() {
    return this.productForm.get('price');
  }

  get description() {
    return this.productForm.get('description');
  }

  get category() {
    return this.productForm.get('category');
  }

  get image() {
    return this.productForm.get('image');
  }

  get quantity() {
    return this.productForm.get('quantity');
  }

  get _id() {
    return this.productForm.get('_id');
  }

  ngOnInit(): void {
    this.productService
      .getProducts()
      .subscribe((prodData: IProductsResponse) => {
        this.products = prodData.products;
        console.log(this.products);
      });
  }

  deleteProduct(productId: string) {
    this.productService
      .deleteProduct(productId)
      .then((data: IProductResponse) => {
        if (data.success)
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate(['/admin/dashboard']);
            });
      });
  }

  processProductInfo(product) {
    this.product = this.productForm.patchValue(product);
  }

  updateProduct() {
    console.log(this._id, this.productForm.value);
    if (this.productForm.invalid) {
      return;
    }

    let formData: IProductInput = {
      title: this.title.value,
      category: this.category.value,
      price: this.price.value,
      description: this.description.value,
      quantity: this.quantity.value,
      image: this.image.value,
    };

    this.productService
      .updateProduct(this._id.value, formData)
      .then((data: IProductResponse) => {
        if (data.success)
          // this.router
          //   .navigateByUrl('/', { skipLocationChange: true })
          //   .then(() => {
          //     this.router.navigate(['/admin/dashboard']);
          //   });
          window.location.reload();
      });
  }
}
