import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { IProductServer } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  category: string;
  categoryProducts: IProductServer[] = [];

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
    .subscribe((category) => {
      this.category = category;

      // Load related products matching the current product's category
      this.productService.getProductsByCategory(category).subscribe((products) => {
        this.categoryProducts = products;
        console.log(this.categoryProducts)
      });

    });
  }

}