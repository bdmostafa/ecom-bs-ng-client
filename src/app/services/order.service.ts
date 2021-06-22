import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICartInfo } from 'src/app/services/cart.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private SERVER_URL = environment.SERVER_URL;

  constructor(private http: HttpClient) {}

  getOrderById(orderId: string) {
    return this.http
      .get<IOrderResponse>(this.SERVER_URL + '/orders/' + orderId)
      .toPromise();
  }

  createOrder(cartInfo: ICartInfo[]) {
    return this.http
      .post<IOrderResponse>(this.SERVER_URL + '/orders/create', cartInfo)
      .toPromise();
  }

  getMyOrders() {
    return this.http
      .get<IOrdersResponse>(this.SERVER_URL + '/orders/user/my-orders')
      .toPromise();
  }

  getAllOrders() {
    return this.http
      .get<IOrdersResponse>(this.SERVER_URL + '/orders')
      .toPromise();
  }

  updateOrderStatus(orderId: string, status: string) {
    console.log(orderId, status);
    return this.http
      .put<IOrderResponse>(this.SERVER_URL + '/orders/update/' + orderId, {
        status,
      })
      .toPromise();
  }

  getOrdersByDate(date: string) {
    return this.http
      .get<IOrdersResponse>(this.SERVER_URL + '/orders/orders-by-date/' + date)
      .toPromise();
  }

  getPendingOrders() {
    return this.http
      .get<IOrdersResponse>(this.SERVER_URL + '/orders/pending-orders')
      .toPromise();
  }
}

export interface IOrder {
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

export interface IOrdersResponse {
  orders: IOrder[];
  success: {
    title: string;
    message: string;
  };
}
export interface IOrderResponse {
  order: IOrder;
  success: {
    title: string;
    message: string;
  };
}
