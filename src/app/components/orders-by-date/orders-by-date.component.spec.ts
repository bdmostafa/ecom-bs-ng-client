import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersByDateComponent } from './orders-by-date.component';

describe('OrdersByDateComponent', () => {
  let component: OrdersByDateComponent;
  let fixture: ComponentFixture<OrdersByDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersByDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersByDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
