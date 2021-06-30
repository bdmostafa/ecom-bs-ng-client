import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
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
import { CreateProductComponent } from './components/create-product/create-product.component';
import { GenerateProductComponent } from './components/generate-product/generate-product.component';
import { ProductsByCategoryComponent } from './components/products-by-category/products-by-category.component';
import { AllOrdersComponent } from './components/all-orders/all-orders.component';
import { OrderByIdComponent } from './components/order-by-id/order-by-id.component';
import { PendingOrdersComponent } from './components/pending-orders/pending-orders.component';
import { OrdersByDateComponent } from './components/orders-by-date/orders-by-date.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { AdminGuard } from './guard/admin.guard';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

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
        path: 'products/:productId',
        component: ProductDetailComponent,
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
  // Define routes for the admin panel under a separate component for the layout of AdminLayoutComponent
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    canActivateChild: [AdminGuard],
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
      },
      {
        path: 'products-by-category',
        component: ProductsByCategoryComponent,
      },
      {
        path: 'create-product',
        component: CreateProductComponent,
      },
      {
        path: 'generate-products',
        component: GenerateProductComponent,
      },
      {
        path: 'all-orders',
        component: AllOrdersComponent,
      },
      {
        path: 'orders/order-by-id',
        component: OrderByIdComponent,
      },
      {
        path: 'pending-orders',
        component: PendingOrdersComponent,
      },
      {
        path: 'order-by-date',
        component: OrdersByDateComponent,
      },
      {
        path: 'all-users',
        component: AllUsersComponent,
      },
      {
        path: 'create-user',
        component: CreateUserComponent,
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
