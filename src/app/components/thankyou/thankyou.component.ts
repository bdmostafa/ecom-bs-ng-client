import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css'],
})
export class ThankyouComponent implements OnInit {

  @ViewChild('tableOrderData') htmlData:ElementRef;

  orderId: string;
  productOrdered: IProductOrderedResponse[];
  cartTotal: number;
  message: string;

  constructor(private orderService: OrderService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();

    console.log(navigation.extras);
    const state = navigation.extras.state as {
      order: {
        message: string;
        productOrdered: IProductOrderedResponse[];
        _id: string;
      };
      totalPrice: number;
    };

    this.message = state.order.message;
    this.productOrdered = state.order.productOrdered;
    this.orderId = state.order._id;
    this.cartTotal = state.totalPrice;
  }

  ngOnInit(): void {}

  //TODO SENDING EMAIL CONFIRMATION FUNCTIONALITY

  public openPDF() {
    let DATA = document.getElementById('tableOrderData');
      
    html2canvas(DATA).then(canvas => {
        console.log(canvas)
        let fileWidth = 208;
        let fileHeight = canvas.height * fileWidth / canvas.width;
        
        const FILEURI = canvas.toDataURL('image/png')
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)
        
        PDF.save(`order-${this.orderId}.pdf`);
    });     
  }
}

interface IProductOrderedResponse {
  product: {
    _id: string;
    category: string;
    title: string;
    description: string;
    price: number;
    image: string;
  };
  quantity: number;
}
