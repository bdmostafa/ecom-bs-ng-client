import { IOrder, IOrdersResponse } from './../../services/order.service';
import { Component, OnInit } from '@angular/core';
import {
  IOrderResponse,
  OrderService,
} from 'src/app/services/order.service';
import { IStatusInfo } from '../all-orders/all-orders.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pending-orders',
  templateUrl: './pending-orders.component.html',
  styleUrls: ['./pending-orders.component.css'],
})
export class PendingOrdersComponent implements OnInit {
  orders: IOrder[];
  statusList = ['Pending', 'Approved', 'On going', 'Delivered'];
  statusData: IStatusInfo;

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    // Load user orders if he/she has any orders
    this.orderService.getPendingOrders().then((ordersData: IOrdersResponse) => {
      console.log(ordersData.orders);
      this.orders = ordersData.orders;
    });
  }

  // TODO status change functionality
  updateStatus(id: string, status: string) {
    this.statusData = { id, status };
    console.log(this.statusData);

    this.orderService
      .updateOrderStatus(id, status)
      .then((order: IOrderResponse) => {
        if (order.success) {
          this.router.navigateByUrl('/admin/pending-orders');
        }
      });
  }
}
