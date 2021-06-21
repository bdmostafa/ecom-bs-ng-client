import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { IProduct } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { IProductsResponse, ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  category: string;
  categoryProducts: IProduct[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private cartService: CartService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.paramMap
    .pipe(
      map((param: ParamMap) => {
        // @ts-ignore
        return param.params.categoryName;
      })
    )
    .subscribe((category: string) => {
      this.category = category;

      // Load related products matching the current product's category
      this.productService.getProductsByCategory(category).subscribe((prodData: IProductsResponse) => {
        this.categoryProducts = prodData.products;
        console.log(this.categoryProducts)
      });

    });
  }

}
