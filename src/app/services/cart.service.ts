import { ICartPublic, ICartServer } from './../models/cart.model';
import { OrderService } from './order.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
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

  // Data variable to store the cart info on the server (inside ng app)
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

              // Update cartInfoClient and local storage
              this.cartInfoClient.total = this.cartInfoServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartInfoClient));
            } else {
              // If cartInfoServer already has some entry in it
              this.cartInfoServer.data.push({
                numInCart: prod.inCart,
                product: actualProductInfo,
              });
              // TODO Create CalculateTotal Function and replace it here

              // Update cartInfoClient and local storage
              this.cartInfoClient.total = this.cartInfoServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartInfoClient));
            }
            // Emits the current value to new subscribers
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
        // Update cartInfoClient and local storage
        this.cartInfoClient.total = this.cartInfoServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartInfoClient));

        // Emits the current value to new subscribers
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

          // Update cartInfoClient and local storage
          this.cartInfoClient.total = this.cartInfoServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartInfoClient));

          // Emits the current value to new subscribers
          this.cartData$.next({ ...this.cartInfoServer });
        } // END OF ELSE
      }
    });
  }

  updateCart(idx: number, increase: boolean) {
    let data = this.cartInfoServer.data[idx];

    if (increase) {
      // If product quantity is more than number in cart, increase it
      data.numInCart < data.product.quantity
        ? data.numInCart++
        : data.product.quantity;
      this.cartInfoClient.productInfo[idx].inCart = data.numInCart;
      this.calculateTotal();

      // Update cartInfoClient and local storage
      this.cartInfoClient.total = this.cartInfoServer.total;
      localStorage.setItem('cart', JSON.stringify(this.cartInfoClient));

      // Emits the current value to new subscribers
      this.cartData$.next({ ...this.cartInfoServer });
    } else {
      data.numInCart--;

      if (data.numInCart < 1) {
        // TODO DELETE FROM CART
        this.cartData$.next({ ...this.cartInfoServer });
      } else {
        this.cartData$.next({ ...this.cartInfoServer });
        this.cartInfoClient.productInfo[idx].inCart = data.numInCart;
        this.calculateTotal();

        // Update cartInfoClient and local storage
        this.cartInfoClient.total = this.cartInfoServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartInfoClient));
      }
    }
  }

  deleteProductFromCart(idx: number) {
    if (window.confirm('Are you sure to remove the product?')) {
      // Delete from data variables to store
      this.cartInfoServer.data.splice(idx, 1);
      this.cartInfoClient.productInfo.splice(idx, 1);
      this.calculateTotal();

      this.cartInfoClient.total = this.cartInfoServer.total;

      // Assign default value to cartInfoClient if total is 0
      // And update local storage through updated cartInfoClient object
      if (this.cartInfoClient.total === 0) {
        this.cartInfoClient = {
          total: 0,
          productInfo: [{ inCart: 0, _id: '' }],
        };
        localStorage.setItem('cart', JSON.stringify(this.cartInfoClient));
      } else {
        localStorage.setItem('cart', JSON.stringify(this.cartInfoClient));
      }

      // Assign default value to cartInfoServer if total is 0.
      // And emit cartData object
      if (this.cartInfoServer.total === 0) {
        this.cartInfoServer = {
          total: 0,
          data: [{ numInCart: 0, product: undefined }],
        };
        this.cartData$.next({ ...this.cartInfoServer });
      } else {
        this.cartData$.next({ ...this.cartInfoServer });
      }
    } else {
      // Cancel Button click -> Not willing to remove
      return;
    }
  }

  checkoutFromCart(userId: string) {
    this.http
      .post(this.SERVER_URL + '/orders/payment', null)
      .subscribe((res: { success: boolean }) => {
        if (res.success) {
          this.resetCartInfoServer();

          this.http
            .post(this.SERVER_URL + 'orders/new', {
              userId,
              products: this.cartInfoClient.productInfo,
            })
            .subscribe((data: IOrderResponse) => {
              this.orderService.getOrderById(data.orderId).then((products) => {
                if (data.success) {
                  // To pass additional information
                  const navigationExtras: NavigationExtras = {
                    state: {
                      products,
                      message: data.message,
                      orderId: data.orderId,
                      total: this.cartInfoClient.total,
                    },
                  };

                  // TODO HIDE SPINNER

                  this.router
                    .navigate(['/thankyou'], navigationExtras)
                    .then((p) => {
                      // Reset cartInfoClient, cartTotal
                      this.cartInfoClient = {
                        total: 0,
                        productInfo: [{ inCart: 0, _id: '' }],
                      };
                      this.cartTotal$.next(0);

                      // Update local storage
                      localStorage.setItem(
                        'cart',
                        JSON.stringify(this.cartInfoClient)
                      );
                    });
                }
              });
            });
        }
      });
  }

  private calculateTotal() {
    let total = 0;

    // Loop through each cart and calculate total price
    this.cartInfoServer.data.forEach((prod) => {
      const { numInCart } = prod;
      const { price } = prod.product;

      total += numInCart * price;
    });

    // Assign total price to data variable to store
    this.cartInfoServer.total = total;
    // Emit the current value total
    this.cartTotal$.next(this.cartInfoServer.total);
  }

  private resetCartInfoServer() {
    this.cartInfoServer = {
      total: 0,
      data: [{ numInCart: 0, product: undefined }],
    };
    this.cartData$.next({ ...this.cartInfoServer });
  }
}

interface IOrderResponse {
  orderId: string;
  success: boolean;
  message: string;
  products: [
    {
      _id: string;
      numInCart: string;
    }
  ];
}
