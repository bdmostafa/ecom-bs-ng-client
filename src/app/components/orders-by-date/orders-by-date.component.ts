import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IOrder, IOrderResponse, IOrdersResponse, OrderService } from 'src/app/services/order.service';
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
      (ordersData: IOrdersResponse) => {
        console.log(ordersData);

        if (ordersData.orders.length > 0) {
          this.orders = ordersData.orders;
        } else {
          this.orders = [];
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
        if (order?.success) {
          // 
        }
      }
    );
  }
}
