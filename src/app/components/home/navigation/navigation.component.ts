import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  @Output() setCategory: EventEmitter<boolean> = new EventEmitter();
  @Output() setHome: EventEmitter<boolean> = new EventEmitter();

  isCategory: boolean = false;
  isHome: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  selectCategory() {
    this.isCategory = true;
    this.isHome = false;
    this.setCategory.emit(this.isCategory);
    this.setHome.emit(this.isHome);
  }

  selectHome() {
    this.isHome = true;
    this.isCategory = false;
    this.setCategory.emit(this.isCategory);
    this.setHome.emit(this.isHome);
  }

}
