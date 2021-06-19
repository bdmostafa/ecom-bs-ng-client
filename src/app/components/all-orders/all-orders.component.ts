import { IOrder, IOrderResponse, IOrdersResponse, OrderService } from './../../services/order.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css'],
})
export class AllOrdersComponent implements OnInit {
  orders: IOrder[];
  statusList = ['Pending', 'Approved', 'On going', 'Delivered'];
  statusData: IStatusInfo;

  constructor(private router: Router, private orderService: OrderService) {}

  ngOnInit(): void {
    // Load all orders from the backend
    this.orderService.getAllOrders().then((ordersData: IOrdersResponse) => {
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
          this.router.navigateByUrl('/admin/all-orders');
        }
      });
  }
}

export interface IStatusInfo {
  id: string;
  status: string;
}
