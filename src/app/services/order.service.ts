import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICartInfo } from 'src/app/services/cart.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private products: IProductResponse[] = [];
  private SERVER_URL = environment.SERVER_URL;

  constructor(private http: HttpClient) {}

  getOrderById(orderId: string) {
    return this.http
      .get<IOrderResponse>(this.SERVER_URL + '/orders/' + orderId, {withCredentials: true})
      .toPromise();
  }

  createOrder(cartInfo: ICartInfo[]) {
    return this.http
      .post<IOrderResponse>(this.SERVER_URL + '/orders/create', cartInfo, {withCredentials: true})
      .toPromise();
  }

  getMyOrders() {
    return this.http
      .get<IOrderResponse[]>(this.SERVER_URL + '/orders/user/my-orders', {withCredentials: true})
      .toPromise();
  }

  getAllOrders() {
    return this.http
      .get<IOrderResponse[]>(this.SERVER_URL + '/orders', {withCredentials: true})
      .toPromise();
  }

  updateOrderStatus(orderId: string, status: string) {
    console.log(orderId, status)
    return this.http
      .patch<IOrderResponse>(this.SERVER_URL + '/orders/update/' + orderId, {
        status,
      }, {withCredentials: true})
      .toPromise();
  }

  getOrdersByDate(date: string) {
    return this.http
    .get<IOrderResponse[]>(this.SERVER_URL + '/orders/orders-by-date/' + date, {withCredentials: true})
    .toPromise();
  }

  getPendingOrders() {
    return this.http
      .get<IOrderResponse[]>(this.SERVER_URL + '/orders/pending-orders', {withCredentials: true})
      .toPromise();
  }
}

export interface IOrderResponse {
  _id: string;
  productOrdered: [
    {
      product: string;
      quantity: number;
    }
  ];
  status: string;
  success: boolean;
  message: string;
  customer: [
    {
      _id: string;
      name: string;
      email: string;
    }
  ];
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
