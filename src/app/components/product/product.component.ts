import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { map } from 'rxjs/operators';

declare let $: any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit, AfterViewInit {
  id: string;
  product;
  thumbImages: any[] = [];
  categoryProducts;

  @ViewChild('quantity') quantityInput;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((param: ParamMap) => {
          // @ts-ignore
          return param.params.id;
        })
      )
      .subscribe((prodId) => {
        this.id = prodId;

        this.productService.getProduct(this.id).subscribe((prod) => {
          // Load related products matching the current product's category
          this.productService.getProductsByCategory(prod.category).subscribe((products) => {
            this.categoryProducts = products;
            console.log(this.categoryProducts)
          });

          // Assign the current product details
          this.product = prod;
          console.log(this.product);

          if (prod.images !== null) {
            this.thumbImages = prod.images.split(';');
          }

          
        });
      });

      
  }

  ngAfterViewInit(): void {
    // Product Main img Slick
    $('#product-main-img').slick({
      infinite: true,
      speed: 300,
      dots: false,
      arrows: true,
      fade: true,
      asNavFor: '#product-imgs',
    });

    // Product imgs Slick
    $('#product-imgs').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      centerMode: true,
      focusOnSelect: true,
      centerPadding: 0,
      vertical: true,
      asNavFor: '#product-main-img',
      responsive: [
        {
          breakpoint: 991,
          settings: {
            vertical: false,
            arrows: false,
            dots: true,
          },
        },
      ],
    });

    // Product img zoom
    var zoomMainProduct = document.getElementById('product-main-img');
    if (zoomMainProduct) {
      $('#product-main-img .product-preview').zoom();
    }
  }

  public increaseQty() {
    let qty = parseInt(this.quantityInput.nativeElement.value);

    if (this.product.quantity >= 1) {
      qty++;

      if (qty > this.product.quantity) {
        qty = this.product.quantity;
      }
    } else {
      return;
    }

    this.quantityInput.nativeElement.value = qty.toString();
  }

  public decreaseQty() {
    let qty = parseInt(this.quantityInput.nativeElement.value);

    if (this.product.quantity > 0) {
      qty--;

      if (qty <= 1) {
        qty = 1;
      }
    } else {
      return;
    }

    this.quantityInput.nativeElement.value = qty.toString();
  }

  addToCart(id: string) {
    this.cartService.addToCart(id, this.quantityInput.nativeElement.value);
  }

  selectProduct(id: String) {
    this.router.navigate(['/products', id]).then();
  }
}
