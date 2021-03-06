import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private SERVER_URL = environment.SERVER_URL;
  constructor(private http: HttpClient) {}

  // Load all products from server
  getProducts(): Observable<IProductsResponse> {
    return this.http.get<IProductsResponse>(`${this.SERVER_URL}/products`);
  }

  /* GET SINGLE PRODUCT FROM BACKEND*/
  getProduct(id: string): Observable<IProductResponse> {
    return this.http.get<IProductResponse>(this.SERVER_URL + '/products/' + id);
  }

  /*GET PRODUCTS FROM ONE CATEGORY */
  getProductsByCategory(categoryName: string): Observable<IProductsResponse> {
    return this.http.get<IProductsResponse>(
      this.SERVER_URL + '/products/category/' + categoryName
    );
  }

  // Create product by form data
  createProduct(formData: IProductInput): Observable<IProductResponse> {
    // console.log(formData);
    return this.http.post<IProductResponse>(
      `${this.SERVER_URL}/products/create`,
      formData
    );
  }

  // Generate products from third party API
  generateProductsByThirdParty() {
    return this.http.get<IProductsResponse>(
      `${this.SERVER_URL}/products/generate-products`
    );
  }

  updateProduct(productId: string, productInfo: IProductInput) {
    return this.http
    .put<IProductResponse>(this.SERVER_URL + `/products/update/${productId}`, productInfo)
    .toPromise();
  }

  deleteProduct(productId: string) {
    return this.http
      .delete<IProductResponse>(this.SERVER_URL + `/products/delete/${productId}`)
      .toPromise();
  }
}

export interface IProduct {
  _id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  images: string;
}
export interface IProductInput {
  title: string;
  category: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
}

export interface IProductsResponse {
  products: IProduct[];
  success: {
    message: string;
    title: string;
  };
}
export interface IProductResponse {
  product: IProduct;
  success: {
    message: string;
    title: string;
  };
}
