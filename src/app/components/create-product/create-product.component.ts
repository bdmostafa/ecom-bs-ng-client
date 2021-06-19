import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
})
export class CreateProductComponent implements OnInit {
  productForm: FormGroup;

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
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

    // @ts-ignore
    this.productService.createProduct({ ...this.productForm.value }).subscribe(
      (response: IProduct) => {
        console.log(response);

        this.router.navigateByUrl('/admin/dashboard');
      }
    );

    this.productForm.reset();
  }
}
