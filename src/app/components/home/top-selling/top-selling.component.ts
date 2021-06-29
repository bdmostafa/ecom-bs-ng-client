import { Component, Input, OnInit } from '@angular/core';
import { IProduct } from 'src/app/services/product.service';

@Component({
  selector: 'app-top-selling',
  templateUrl: './top-selling.component.html',
  styleUrls: ['./top-selling.component.css']
})
export class TopSellingComponent implements OnInit {
  @Input() ascProducts: IProduct[];

  constructor() { }

  ngOnInit(): void {
  }

}
