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
    return this.http.get<IProductResponse[]>(this.SERVER_URL + '/orders/' + orderId).toPromise();
  }
}



interface IProductResponse {
  _id: string;
  title: string;
  description: string;
  price: string;
  quantityOrdered: number;
  image: string;
}