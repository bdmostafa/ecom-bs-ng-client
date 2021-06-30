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

  public page: number = 1;
  public pageSize: number = 3;
  public collectionSize: number;

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

          setTimeout(() => {
            this.orders = ordersData.orders;
            this.collectionSize = ordersData?.orders?.length;
            this.spinner.hide().then();
          }, 1000);
        });
      setTimeout(() => {
        this.spinner.hide().then();
      }, 1000);
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
                this.router.navigate(['/admin/pending-orders']);
              });
          }
        });
    });
  }
}
