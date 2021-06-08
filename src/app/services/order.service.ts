import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private products: IProductResponse[] = [];
  private SERVER_URL = environment.SERVER_URL;

  constructor(private http: HttpClient) { }

  getOrderById(orderId: string) {
    return this.http.get<IOrderResponse[]>(this.SERVER_URL + '/orders/' + orderId).toPromise();
  }

  getMyOrders() {
    return this.http.get<IOrderResponse[]>(this.SERVER_URL + '/orders/user/my-orders').toPromise();
  }

}

export interface IOrderResponse {
  _id: string;
  productOrdered: [{
    product: string,
    quantity: number
  }];
  status: string;
  success: boolean;
  message: string;
  customer: [{
    _id: string,
    name: string,
    email: string
  }];
  date: string;
}

interface IProductResponse {
  _id: string;
  title: string;
  description: string;
  price: string;
  quantityOrdered: number;
  image: string;
}