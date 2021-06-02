import { ICartPublic, ICartServer } from './../models/cart.model';
import { OrderService } from './order.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { IProductServer } from '../models/product.model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

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
  cartInfo$ = new BehaviorSubject<ICartServer>(this.cartInfoServer);

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.cartTotal$.next(this.cartInfoServer.total);
    this.cartInfo$.next(this.cartInfoServer);

    // Get the info from Local Storage
    let info: ICartPublic = JSON.parse(localStorage.getItem('cart'));

    // Check whether the info is null or has some data
    if (
      info !== null &&
      info !== undefined &&
      info.productInfo[0].inCart !== 0
    ) {
      this.cartInfoClient = info;

      //  Loop through each entry and put it in the cartInfoServer object
      this.cartInfoClient.productInfo.forEach((prod) => {
        this.productService
          .getProduct(prod._id)
          .subscribe((actualProductInfo: IProductServer) => {
            if (this.cartInfoServer.data[0].numInCart === 0) {
              this.cartInfoServer.data[0].numInCart = prod.inCart;
              this.cartInfoServer.data[0].product = actualProductInfo;
              // Calculate total price
              this.calculateTotal();
              // Update cartInfoClient and local storage
              this.cartInfoClient.total = this.cartInfoServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartInfoClient));
            } else {
              // If cartInfoServer already has some entry in it
              this.cartInfoServer.data.push({
                numInCart: prod.inCart,
                product: actualProductInfo,
              });
              // Calculate total price
              this.calculateTotal();

              // Update cartInfoClient and local storage
              this.cartInfoClient.total = this.cartInfoServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartInfoClient));
            }
            // Emits the current value to new subscribers
            this.cartInfo$.next({ ...this.cartInfoServer });
          });
      });
    }
  }

  addToCart(id: string, qty?: number) {
    this.productService.getProduct(id).subscribe((product) => {
      // 1. If the cart is empty
      if (this.cartInfoServer.data[0].product === undefined) {
        console.log('1');
        this.cartInfoServer.data[0].product = product;
        this.cartInfoServer.data[0].numInCart = qty !== undefined ? qty : 1;

        // Calculate total price
        this.calculateTotal();

        this.cartInfoClient.productInfo[0].inCart =
          this.cartInfoServer.data[0].numInCart;
        this.cartInfoClient.productInfo[0]._id = product._id;

        // Update cartInfoClient and local storage
        this.cartInfoClient.total = this.cartInfoServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartInfoClient));

        // Emits the current value to new subscribers
        this.cartInfo$.next({ ...this.cartInfoServer });

        // Success Toastr
        this.toastr.success(
          `${product.title} is added to the cart successfully!`,
          'Add To Cart',
          {
            progressBar: true,
            positionClass: 'toast-top-right',
            progressAnimation: 'increasing',
            timeOut: 2000,
          }
        );
      }
      // 2. If the cart has items
      else {
        console.log(this.cartInfoServer);
        // idx = -1 or a positive value
        let idx = this.cartInfoServer.data.findIndex(
          (p) => p.product._id === product._id
        );
        console.log('2', idx);
        //    2.a. If that item is already in the cart, update qty
        //    idx -> positive value
        if (idx !== -1) {
          console.log('2a');
          if (qty !== undefined && qty <= product.quantity) {
            this.cartInfoServer.data[idx].numInCart =
              this.cartInfoServer.data[idx].numInCart < product.quantity
                ? qty
                : product.quantity;
          } else {
            this.cartInfoServer.data[idx].numInCart < product.quantity
              ? this.cartInfoServer.data[idx].numInCart++
              : product.quantity;
          }

          this.cartInfoClient.productInfo[idx].inCart =
            this.cartInfoServer.data[idx].numInCart;
          // console.log(this.cartInfoServer.data[idx], product.quantity)
          // Calculate total price
          this.calculateTotal();

          // Update cartInfoClient and local storage
          this.cartInfoClient.total = this.cartInfoServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartInfoClient));

          // Info Toastr
          this.toastr.info(
            `${product.title} quantity is updated to the cart successfully!`,
            'Update Product Quantity',
            {
              progressBar: true,
              positionClass: 'toast-top-right',
              progressAnimation: 'increasing',
              timeOut: 1000,
            }
          );
        } // END OF IF

        //   2.b. If that item is not in the cart (idx is -1)
        else {
          console.log('2b');
          this.cartInfoServer.data.push({
            numInCart: 1,
            product: product,
          });

          this.cartInfoClient.productInfo.push({
            inCart: 1,
            _id: product._id,
          });

          // Success Toastr
          this.toastr.success(
            `${product.title} is added to the cart successfully!`,
            'Add To Cart',
            {
              progressBar: true,
              positionClass: 'toast-top-right',
              progressAnimation: 'increasing',
              timeOut: 2000,
            }
          );

          // Calculate total price
          this.calculateTotal();

          // Update cartInfoClient and local storage
          this.cartInfoClient.total = this.cartInfoServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartInfoClient));

          // Emits the current value to new subscribers
          this.cartInfo$.next({ ...this.cartInfoServer });
        } // END OF ELSE
      }
      // console.log(this.cartInfoServer);
      console.log(this.cartTotal$, this.cartInfo$);
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
      this.cartInfo$.next({ ...this.cartInfoServer });
      console.log('increase', data.numInCart);
    } else {
      data.numInCart--;

      if (data.numInCart < 1) {
        // Delete product from the cart and emit the current value
        this.deleteProductFromCart(idx);
        this.cartInfo$.next({ ...this.cartInfoServer });
      } else {
        this.cartInfo$.next({ ...this.cartInfoServer });
        this.cartInfoClient.productInfo[idx].inCart = data.numInCart;
        this.calculateTotal();

        // Update cartInfoClient and local storage
        this.cartInfoClient.total = this.cartInfoServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartInfoClient));
      }
      console.log('decrease', data.numInCart);
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
        this.cartInfo$.next({ ...this.cartInfoServer });
      } else {
        this.cartInfo$.next({ ...this.cartInfoServer });
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

          // Create an array object according to backend data request requirement
          const cartInfo = [];
          this.cartInfoClient.productInfo.map((c) => {
            const product = c._id;
            const quantity = c.inCart;
            cartInfo.push({
              product,
              quantity,
            });
          });
          console.log(this.cartInfoClient.productInfo, cartInfo);
          this.http
            .post(this.SERVER_URL + '/orders/create', cartInfo)
            .subscribe((orderData: IOrderResponse) => {
              console.log("orderData", orderData)
              this.orderService.getOrderById(orderData._id).then((order) => {
                console.log("order", order)
                if (orderData.success) {
                  // To pass additional information
                  const navigationExtras: NavigationExtras = {
                    state: {
                      products: order,
                      message: orderData.message,
                      orderId: orderData._id,
                      total: this.cartInfoClient.total,
                    },
                  };

                  // Hide spinner
                  this.spinner.hide().then();

                  this.router
                    .navigate(['/thankyou'], navigationExtras)
                    .then((p) => {
                      console.log(p)
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
        // If res.success is false
        else {
          this.spinner.hide().then();
          this.router.navigateByUrl('/checkout').then();

          // Error Toastr
          this.toastr.error(
            `Sorry, failed to order. Please try again!`,
            'Order Failed',
            {
              progressBar: true,
              positionClass: 'toast-top-right',
              progressAnimation: 'increasing',
              timeOut: 1500,
            }
          );
        }
      });
  }

  calculateSubTotal(idx): number {
    let subTotal = 0;

    const prod = this.cartInfoServer.data[idx];

    subTotal = prod.product.price * prod.numInCart;

    return subTotal;
  }

  private calculateTotal() {
    let total: number = 0;

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
    this.cartInfo$.next({ ...this.cartInfoServer });
  }
}

interface IOrderResponse {
  _id: string;
  success: boolean;
  message: string;
  products: [
    {
      _id: string;
      numInCart: string;
    }
  ];
}
