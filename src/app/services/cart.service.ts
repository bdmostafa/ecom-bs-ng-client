import { ICartPublic, ICartServer } from './../models/cart.model';
import { OrderService } from './order.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { IProductServer } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private SERVER_URL = environment.SERVER_URL;

  // Data variable to store the cart info on the client's local storage
  private cartInfoClient: ICartPublic = {
    total: 0,
    productInfo: [
      {
        inCart: 0,
        _id: '',
      },
    ],
  };

  // Data variable to store cart information on the server
  private cartInfoServer: ICartServer = {
    total: 0,
    data: [
      {
        numInCart: 0,
        product: undefined,
      },
    ],
  };

  /* OBSERVABLES FOR THE COMPONENTS TO SUBSCRIBE*/
  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<ICartServer>(this.cartInfoServer);

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.cartTotal$.next(this.cartInfoServer.total);
    this.cartData$.next(this.cartInfoServer);

    // Get the info from Local Storage
    let info: ICartPublic = JSON.parse(localStorage.getItem('cart'));

    // Check whether the info is null or has some data
    if (info != null && info != undefined && info.productInfo[0].inCart != 0) {
      this.cartInfoClient = info;

      //  Loop through each entry and put it in the cartInfoServer object
      this.cartInfoClient.productInfo.forEach((prod) => {
        this.productService
          .getProduct(prod._id)
          .subscribe((actualProductInfo: IProductServer) => {
            if (this.cartInfoServer.data[0].numInCart === 0) {
              this.cartInfoServer.data[0].numInCart = prod.inCart;
              this.cartInfoServer.data[0].product = actualProductInfo;
              // TODO Create CalculateTotal Function and replace it here
              this.cartInfoClient.total = this.cartInfoServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartInfoClient));
            } else {
              // If cartInfoServer already has some entry in it
              this.cartInfoServer.data.push({
                numInCart: prod.inCart,
                product: actualProductInfo,
              });
              // TODO Create CalculateTotal Function and replace it here
              this.cartInfoClient.total = this.cartInfoServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartInfoClient));
            }
            this.cartData$.next({ ...this.cartInfoServer });
          });
      });
    }
  }

  addToCart(id: string, qty?: number) {
    this.productService.getProduct(id).subscribe((product) => {
      // 1. If the cart is empty
      if (this.cartInfoServer.data[0].product != undefined) {
        this.cartInfoServer.data[0].product = product;
        this.cartInfoServer.data[0].numInCart = qty != undefined ? qty : 1;

        // TODO CALCULATE TOTAL AMOUNT
        this.cartInfoClient.productInfo[0].inCart =
          this.cartInfoServer.data[0].numInCart;
        this.cartInfoClient.productInfo[0]._id = product._id;

        // TODO Create CalculateTotal Function and replace it here
        this.cartInfoClient.total = this.cartInfoServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartInfoClient));
        this.cartData$.next({ ...this.cartInfoServer });

        // TODO DISPLAY A TOAST NOTIFICATION
      }
      // 2. If the cart has items
      else {
        // idx = -1 or a positive value
        let idx = this.cartInfoServer.data.findIndex(
          (p) => p.product._id === product._id
        );

        //    2.a. If that item is already in the cart
        //    idx -> positive value
        if (idx != -1) {
          if (qty != undefined && qty <= product.quantity) {
            this.cartInfoServer.data[idx].numInCart =
              this.cartInfoServer.data[idx].numInCart < product.quantity
                ? qty
                : product.quantity;
          } else {
            this.cartInfoServer.data[idx].numInCart =
              this.cartInfoServer.data[idx].numInCart < product.quantity
                ? this.cartInfoServer.data[idx].numInCart++
                : product.quantity;
          }

          // TODO CALCULATE TOTAL AMOUNT
          this.cartInfoClient.productInfo[idx].inCart =
            this.cartInfoServer.data[idx].numInCart;

          // TODO DISPLAY A TOAST NOTIFICATION
        } // END OF IF

        //   2.b. If that item is not in the cart (idx is -1)
        else {
          this.cartInfoServer.data.push({
            numInCart: 1,
            product: product,
          });

          this.cartInfoClient.productInfo.push({
            inCart: 1,
            _id: product._id,
          });

          // TODO DISPLAY A TOAST NOTIFICATION

          // TODO Create CalculateTotal Function and replace it here
          this.cartInfoClient.total = this.cartInfoServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartInfoClient));
          this.cartData$.next({ ...this.cartInfoServer });
        } // END OF ELSE
      }
    });
  }
}
