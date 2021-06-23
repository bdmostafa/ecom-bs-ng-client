import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  IOrder,
  IOrderResponse,
  IOrdersResponse,
  OrderService,
} from 'src/app/services/order.service';
import { IStatusInfo } from '../all-orders/all-orders.component';

@Component({
  selector: 'app-orders-by-date',
  templateUrl: './orders-by-date.component.html',
  styleUrls: ['./orders-by-date.component.css'],
})
export class OrdersByDateComponent implements OnInit {
  orders: IOrder[];
  statusList = ['Pending', 'Approved', 'On going', 'Delivered'];
  statusData: IStatusInfo;
  status: string;
  isFetchOrders: boolean = false;

  fetchOrdersForm = new FormGroup({
    date: new FormControl(''),
  });

  constructor(
    private spinner: NgxSpinnerService,
    private orderService: OrderService
  ) {}

  get date() {
    return this.fetchOrdersForm.get('date');
  }

  ngOnInit(): void {}

  fetchOrders() {
    console.log(this.fetchOrdersForm);
    // Add spinner
    this.spinner.show().then((c) => {
      setTimeout(() => {
        if (this.fetchOrdersForm.invalid) {
          this.isFetchOrders = false;
          this.spinner.hide().then();
          return;
        }

        // Load orders by date if the date has any orders
        this.orderService
          .getOrdersByDate(this.fetchOrdersForm.value.date)
          .then((ordersData: IOrdersResponse) => {
            this.isFetchOrders = true;
            if (ordersData?.orders?.length > 0) {
              this.orders = ordersData.orders;
            } else {
              this.orders = [];
            }

            if (ordersData === undefined) this.isFetchOrders = false;
          });
        // Hide spinner after 1 second either success response or error response is happened
        this.spinner.hide().then();
      }, 1000);
    });

    // this.fetchOrdersForm.reset();
  }

  // TODO status change functionality
  updateStatus(id: string, status: string) {
    this.statusData = { id, status };
    console.log(this.statusData);

    this.orderService
      .updateOrderStatus(id, status)
      .then((order: IOrderResponse) => {
        if (order?.success) {
          //
        }
      });
  }
}
