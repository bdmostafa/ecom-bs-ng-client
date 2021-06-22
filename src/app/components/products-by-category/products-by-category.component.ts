import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  IProduct,
  IProductInput,
  IProductResponse,
  IProductsResponse,
  ProductService,
} from 'src/app/services/product.service';

@Component({
  selector: 'app-products-by-category',
  templateUrl: './products-by-category.component.html',
  styleUrls: ['./products-by-category.component.css'],
})
export class ProductsByCategoryComponent implements OnInit {
  products: IProduct[] = [];
  productForm: FormGroup;
  catSelectedProducts: IProduct[] = [];
  product;

  constructor(
    private productService: ProductService,
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService
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
              this.router.navigate(['/admin/products-by-category']);
            });
      });
  }

  processProductInfo(product) {
    this.product = this.productForm.patchValue(product);
  }

  updateProduct() {
    // console.log(this._id, this.productForm.value);
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
        if (data.success) window.location.reload();
      });

    this.productForm.reset();
  }

  searchCategory(category: string) {
    this.catSelectedProducts = [];

    // this.products.map(product => {
    //   if (product.category === category) {
    //     this.catSelectedProducts.push(product)
    //   }
    // })

    // Add spinner
    this.spinner.show().then(() => {
      // Hide spinner
      setTimeout(() => {
        this.catSelectedProducts = category
          ? this.products.filter((product) => {
              return product.category === category;
            })
          : [];
        this.spinner.hide().then();
      }, 1000);
    });

    console.log(this.catSelectedProducts);
  }
}
