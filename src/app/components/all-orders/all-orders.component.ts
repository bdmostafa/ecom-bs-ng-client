import {
  IOrder,
  IOrderResponse,
  IOrdersResponse,
  OrderService,
} from './../../services/order.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css'],
})
export class AllOrdersComponent implements OnInit {
  orders: IOrder[];
  statusList = ['Pending', 'Approved', 'On going', 'Delivered'];
  statusData: IStatusInfo;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    // Load all orders from the backend
    this.orderService.getAllOrders().then((ordersData: IOrdersResponse) => {
      console.log(ordersData.orders);
      this.orders = ordersData.orders;
    });
  }

  updateStatus(id: string, status: string) {
    this.statusData = { id, status };
    console.log(this.statusData);

    // Add spinner
    this.spinner.show().then((c) => {
      this.orderService
        .updateOrderStatus(id, status)
        .then((order: IOrderResponse) => {
          if (order.success) {
            // Hide spinner
            setTimeout(() => {
              this.spinner.hide().then();
            }, 1000);

            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['/admin/all-orders']);
              });
          }
        });
    });
  }
}

export interface IStatusInfo {
  id: string;
  status: string;
}
