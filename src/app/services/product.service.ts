import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IProductServer } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private SERVER_URL = environment.SERVER_URL;
  constructor(private http: HttpClient) {}

  // Load all products from server
  getProducts() {
    return this.http.get(`${this.SERVER_URL}/products`);
  }

  /* GET SINGLE PRODUCT FROM BACKEND*/
  getProduct(id: string): Observable<IProductServer> {
    return this.http.get<IProductServer>(this.SERVER_URL + '/products/' + id);
  }

  /*GET PRODUCTS FROM ONE CATEGORY */
  getProductsByCategory(categoryName: string): Observable<IProductServer[]> {
    return this.http.get<IProductServer[]>(
      this.SERVER_URL + '/products/category/' + categoryName
    );
  }

  // Create product by form data
  createProduct(formData: any): Observable<IProductServer> {
    console.log(formData);
    return this.http.post<IProductServer>(`${this.SERVER_URL}/products/create`, formData);
  }

  // Generate products from third party API
  generateProductsByThirdParty() {
    return this.http.get<IProductServer[]>(`${this.SERVER_URL}/products/generate-products`);
  }
}
