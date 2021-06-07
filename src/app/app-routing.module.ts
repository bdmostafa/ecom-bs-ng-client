import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductComponent } from './components/product/product.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { CategoryComponent } from './components/category/category.component';
import { LoginComponent } from './components/login/login.component';
import { UserComponent } from './components/user/user.component';
import { UserGuard } from './guard/user.guard';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'products/:id', component: ProductComponent
  },
  {
    path: 'products/category/:categoryName', component: CategoryComponent
  },
  {
    path: 'users/login', component: LoginComponent
  },
  {
    path: 'users/me', component: UserComponent, canActivate:[UserGuard]
  },
  {
    path: 'cart', component: CartComponent
  },
  {
    path: 'checkout', component: CheckoutComponent, canActivate:[UserGuard]
  },
  {
    path: 'thankyou', component: ThankyouComponent
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
