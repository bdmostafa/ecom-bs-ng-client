import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  IProductInput,
  IProductResponse,
  ProductService,
} from 'src/app/services/product.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
})
export class CreateProductComponent implements OnInit {
  productForm: FormGroup;

  constructor(
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.productForm = fb.group({
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

  ngOnInit(): void {}

  createProduct() {
    console.log(this.productForm);
    if (this.productForm.invalid) {
      return;
    }

    let formData: IProductInput = this.productForm.value;
    
    // Create products after spinner loading 1 second
    this.spinner.show().then((c) => {
      // @ts-ignore
      this.productService
        .createProduct(formData)
        .subscribe((response: IProductResponse) => {
          console.log(response.product);

          setTimeout(() => {
            this.spinner.hide().then();
            this.router.navigateByUrl('/admin/dashboard');
          }, 1000);
        });

      setTimeout(() => {
        this.spinner.hide().then();
      }, 1000);
    });

    this.productForm.reset();
  }
}
