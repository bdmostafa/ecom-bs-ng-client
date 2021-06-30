import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotDealsProductsComponent } from './hot-deals-products.component';

describe('HotDealsProductsComponent', () => {
  let component: HotDealsProductsComponent;
  let fixture: ComponentFixture<HotDealsProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotDealsProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HotDealsProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
