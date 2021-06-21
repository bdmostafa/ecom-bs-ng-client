import { IOrder, IOrdersResponse } from './../../services/order.service';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { IOrderResponse, OrderService } from 'src/app/services/order.service';
import { IStatusInfo } from '../all-orders/all-orders.component';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-pending-orders',
  templateUrl: './pending-orders.component.html',
  styleUrls: ['./pending-orders.component.css'],
})
export class PendingOrdersComponent implements OnInit {
  orders: IOrder[];
  statusList = ['Pending', 'Approved', 'On going', 'Delivered'];
  statusData: IStatusInfo;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show().then((c) => {
      // Load user orders if he/she has any orders
      this.orderService
        .getPendingOrders()
        .then((ordersData: IOrdersResponse) => {
          console.log(ordersData.orders);
          this.orders = ordersData.orders;
          setTimeout(() => {
            this.spinner.hide().then();
          }, 1000);
        });
    });
  }

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
