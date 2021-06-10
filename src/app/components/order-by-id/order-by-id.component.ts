import { IStatusInfo } from './../all-orders/all-orders.component';
import { Component, OnInit } from '@angular/core';
import { IOrderResponse, OrderService } from 'src/app/services/order.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-order-by-id',
  templateUrl: './order-by-id.component.html',
  styleUrls: ['./order-by-id.component.css'],
})
export class OrderByIdComponent implements OnInit {
  order: IOrderResponse;
  statusList = ['Pending', 'Approved', 'On going', 'Delivered'];
  statusData: IStatusInfo;
  status: string;

  fetchOrderForm = new FormGroup({
    orderId: new FormControl(''),
  });

  constructor(
    private toastr: ToastrService,
    private orderService: OrderService
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

    // Load order by Id
    this.orderService.getOrderById(this.fetchOrderForm.value.orderId).then(
      (order: IOrderResponse) => {
        console.log(order);
        this.order = order;

        // Success notification with ToastrService
        this.toastr.success(`The order ${order._id} is loaded successfully`, 'Fetch Order By Id', {
          progressBar: true,
          positionClass: 'toast-top-right',
          progressAnimation: 'increasing',
          timeOut: 3000,
        });
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
