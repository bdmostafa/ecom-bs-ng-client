import { IStatusInfo } from './../all-orders/all-orders.component';
import { Component, OnInit } from '@angular/core';
import {
  IOrder,
  IOrderResponse,
  OrderService,
} from 'src/app/services/order.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-by-id',
  templateUrl: './order-by-id.component.html',
  styleUrls: ['./order-by-id.component.css'],
})
export class OrderByIdComponent implements OnInit {
  order: IOrder;
  statusList = ['Pending', 'Approved', 'On going', 'Delivered'];
  statusData: IStatusInfo;
  status: string;

  fetchOrderForm = new FormGroup({
    orderId: new FormControl(''),
  });

  constructor(
    private orderService: OrderService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  get orderId() {
    return this.fetchOrderForm.get('orderId');
  }

  ngOnInit(): void {}

  fetchOrder() {
    // console.log(this.fetchOrderForm);
    if (this.fetchOrderForm.invalid) {
      return;
    }

    // Add spinner
    this.spinner.show().then((c) => {
      // Load order by Id
      this.orderService
        .getOrderById(this.fetchOrderForm.value.orderId)
        .then((orderData: IOrderResponse) => {
          console.log(orderData.order);

          // Hide spinner
          setTimeout(() => {
            this.order = orderData.order;
            this.spinner.hide().then();
          }, 1000);
        });

      // Hide spinner
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

            this.router.navigate(['/admin/all-orders']);
          }
        });
    });
  }
}
