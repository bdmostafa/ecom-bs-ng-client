import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IOrderResponse, OrderService } from 'src/app/services/order.service';
import { IStatusInfo } from '../all-orders/all-orders.component';

@Component({
  selector: 'app-orders-by-date',
  templateUrl: './orders-by-date.component.html',
  styleUrls: ['./orders-by-date.component.css'],
})
export class OrdersByDateComponent implements OnInit {
  orders: IOrderResponse[];
  statusList = ['Pending', 'Approved', 'On going', 'Delivered'];
  statusData: IStatusInfo;
  status: string;

  fetchOrdersForm = new FormGroup({
    date: new FormControl(''),
  });

  constructor(
    private toastr: ToastrService,
    private orderService: OrderService
  ) {}

  get date() {
    return this.fetchOrdersForm.get('date');
  }

  ngOnInit(): void {}

  fetchOrders() {
    console.log(this.fetchOrdersForm);
    if (this.fetchOrdersForm.invalid) {
      return;
    }

    // Load orders if he/she has any orders
    this.orderService.getOrdersByDate(this.fetchOrdersForm.value.date).then(
      (orders: IOrderResponse[]) => {
        console.log(orders);

        if (orders.length > 0) {
          this.orders = orders;
        } else {
          this.orders = [];
        }

        // Success notification with ToastrService
        this.toastr.success(
          `The orders of ${this.fetchOrdersForm.value.date} is loaded successfully`,
          'Orders By Date',
          {
            progressBar: true,
            positionClass: 'toast-top-right',
            progressAnimation: 'increasing',
            timeOut: 3000,
          }
        );
      },
      // Error handling with ToastrService
      (error: any) => {
        console.log(error);
        const statusText = error.statusText;
        // If error.error is array
        if (typeof error.error === 'object' && error.error instanceof Array) {
          error.error.forEach((element) => {
            this.toastr.error(element.msg, statusText, {
              progressBar: true,
              positionClass: 'toast-top-right',
              progressAnimation: 'increasing',
              timeOut: 3000,
            });
          });
        } else {
          // When error.error is not an array
          this.toastr.error(error.error, error.statusText, {
            progressBar: true,
            positionClass: 'toast-top-right',
            progressAnimation: 'increasing',
            timeOut: 3000,
          });
        }
      }
    );
  }

  // TODO status change functionality
  updateStatus(id: string, status: string) {
    this.statusData = { id, status };
    console.log(this.statusData);

    this.orderService.updateOrderStatus(id, status).then(
      (order: IOrderResponse) => {
        if (order?.status) {
          // Success notification with ToastrService
          this.toastr.success('All orders loaded successfully', 'All Orders', {
            progressBar: true,
            positionClass: 'toast-top-right',
            progressAnimation: 'increasing',
            timeOut: 3000,
          });
        }
      },
      // Error handling with ToastrService
      (error: any) => {
        console.log(error);
        const statusText = error.statusText;
        // If error.error is array
        if (typeof error.error === 'object' && error.error instanceof Array) {
          error.error.forEach((element) => {
            this.toastr.error(element.msg, statusText, {
              progressBar: true,
              positionClass: 'toast-top-right',
              progressAnimation: 'increasing',
              timeOut: 3000,
            });
          });
        } else {
          // When error.error is not an array
          this.toastr.error(error.message, error.statusText, {
            progressBar: true,
            positionClass: 'toast-top-right',
            progressAnimation: 'increasing',
            timeOut: 3000,
          });
        }
      }
    );
  }
}
