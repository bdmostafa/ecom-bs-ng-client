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
// import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css'],
})
export class AllProductsComponent implements OnInit {
  public products: IProduct[];
  public productForm: FormGroup;
  public product;

  public page: number = 1;
  public pageSize: number = 10;
  public collectionSize: number;

  public searchTerm: string;
  public allProducts: IProduct[];

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

  // option veriable to use in angular2csv
  public options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    headers: ['Image', 'Title', 'Description', 'Category', 'Price', 'Quantity'],
    showTitle: true,
    title: 'Products List',
    useBom: true,
    removeNewLines: true,
    keys: ['image', 'title', 'description', 'category', 'price', 'quantity'],
  };

  ngOnInit(): void {
    this.productService
      .getProducts()
      .subscribe((prodData: IProductsResponse) => {
        this.collectionSize = prodData?.products?.length;
        this.products = prodData?.products;
        // console.log(this.products);
        this.allProducts = this.products.length && this.products;
      });
  }

  public deleteProduct(productId: string) {
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

  public processProductInfo(product) {
    this.product = this.productForm.patchValue(product);
  }

  public updateProduct() {
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

    this.productForm.reset();
  }

  public search(value: string): void {
    this.products = this.allProducts.filter((val) =>
      val.title.toLowerCase().includes(value)
    );
    this.collectionSize = this.products.length;
    console.log(this.products);
  }

  // TODO - printData does not work. To be fixed later
  public printData() {
    let divToPrint = document.getElementById('tableRecords');
    let newWin = window.open('');
    newWin.document.write(divToPrint.outerHTML);
    newWin.print();
    newWin.close();
  }
}
