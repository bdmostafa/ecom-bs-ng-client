import { IStatusInfo } from './../all-orders/all-orders.component';
import { Component, OnInit } from '@angular/core';
import { IOrder, IOrderResponse, OrderService } from 'src/app/services/order.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup } from '@angular/forms';

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
      (orderData: IOrderResponse) => {
        console.log(orderData.order);
        this.order = orderData.order;
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
          console.log(order)
        }
      }
    );
  }
}
