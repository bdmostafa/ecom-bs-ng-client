import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IOrderResponse, OrderService } from 'src/app/services/order.service';
import { IStatusInfo } from '../all-orders/all-orders.component';

@Component({
  selector: 'app-pending-orders',
  templateUrl: './pending-orders.component.html',
  styleUrls: ['./pending-orders.component.css']
})
export class PendingOrdersComponent implements OnInit {
  orders: IOrderResponse[];
  statusList = ['Pending', 'Approved', 'On going', 'Delivered'];
  statusData: IStatusInfo;

  constructor(
    private toastr: ToastrService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    // Load user orders if he/she has any orders
    this.orderService.getPendingOrders().then(
      (orders: IOrderResponse[]) => {
        console.log(orders);
        this.orders = orders;

        // Success notification with ToastrService
        this.toastr.success('Pending orders has been loaded successfully', 'Pending Orders', {
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
    this.statusData = {id, status};
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
