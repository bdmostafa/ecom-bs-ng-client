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

        // Success notification with ToastrService
        this.toastr.success(
          'You created a product successfully',
          'Product Create',
          {
            progressBar: true,
            positionClass: 'toast-top-right',
            progressAnimation: 'increasing',
            timeOut: 3000,
          }
        );

        this.router.navigateByUrl('/admin/dashboard');
      },
      // Error handling with ToastrService
      (error: any) => {
        console.log(error);
        const statusText = error.statusText;
        // If error.error is array
        if (typeof error.error === 'object' && error.error instanceof Array) {
          error.error.forEach((element) => {
            this.toastr.error(element.msg, statusText, {
              progressBar: true,
              positionClass: 'toast-top-right',
              progressAnimation: 'increasing',
              timeOut: 3000,
            });
          });
        } else {
          // When error.error is not an array
          this.toastr.error(error.error, error.statusText, {
            progressBar: true,
            positionClass: 'toast-top-right',
            progressAnimation: 'increasing',
            timeOut: 3000,
          });
        }
      }
    );

    this.productForm.reset();
  }
}
