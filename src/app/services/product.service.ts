import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IProduct } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private SERVER_URL = environment.SERVER_URL;
  constructor(private http: HttpClient) {}

  // Load all products from server
  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.SERVER_URL}/products`);
  }

  /* GET SINGLE PRODUCT FROM BACKEND*/
  getProduct(id: string): Observable<IProduct> {
    return this.http.get<IProduct>(this.SERVER_URL + '/products/' + id);
  }

  /*GET PRODUCTS FROM ONE CATEGORY */
  getProductsByCategory(categoryName: string): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(
      this.SERVER_URL + '/products/category/' + categoryName
    );
  }

  // Create product by form data
  createProduct(formData: IProduct): Observable<IProduct> {
    console.log(formData);
    return this.http.post<IProduct>(`${this.SERVER_URL}/products/create`, formData, {withCredentials: true});
  }

  // Generate products from third party API
  generateProductsByThirdParty() {
    return this.http.get<IProduct[]>(`${this.SERVER_URL}/products/generate-products`, {withCredentials: true});
  }

  updateProduct() {
    // TODO
  }

  deleteProduct() {
    // TODO
  }
}
