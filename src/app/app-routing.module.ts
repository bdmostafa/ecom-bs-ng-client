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
import { RegisterComponent } from './components/register/register.component';
import { HomeLayoutComponent } from './components/home-layout/home-layout.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  // Define routes for the landing / home page under a separate component for the layout of home page
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'products/:id',
        component: ProductComponent,
      },
      {
        path: 'products/category/:categoryName',
        component: CategoryComponent,
      },
      {
        path: 'users/login',
        component: LoginComponent,
      },
      {
        path: 'users/me',
        component: UserComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'users/create',
        component: RegisterComponent,
      },
      {
        path: 'cart',
        component: CartComponent,
      },
      {
        path: 'checkout',
        component: CheckoutComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'thankyou',
        component: ThankyouComponent,
      },
    ],
  },
  // Define routes for the admin panel under a separate component for the layout of home page
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'abc',
        component: AdminDashboardComponent,
      },
    ],
  },
  // Wildcard Route if no route is found == 404 NOTFOUND page
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
