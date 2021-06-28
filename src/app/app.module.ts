import { ToastrInterceptor } from './_helpers/toastr.interceptor';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { ProductComponent } from './components/product/product.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { UniqueFilterPipe } from './pipes/unique-filter.pipe';
import { BdCurrencyPipe } from './pipes/bd-currency.pipe';
import { CategoryComponent } from './components/category/category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { UserComponent } from './components/user/user.component';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from 'angularx-social-login';
import { RegisterComponent } from './components/register/register.component';
import { PasswordPatternDirective } from './directives/password-pattern.directive';
import { HomeLayoutComponent } from './components/home-layout/home-layout.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { AdminFooterComponent } from './components/admin-footer/admin-footer.component';
import { AdminSettingComponent } from './components/admin-setting/admin-setting.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { GenerateProductComponent } from './components/generate-product/generate-product.component';
import { ProductsByCategoryComponent } from './components/products-by-category/products-by-category.component';
import { AllOrdersComponent } from './components/all-orders/all-orders.component';
import { OrderByIdComponent } from './components/order-by-id/order-by-id.component';
import { PendingOrdersComponent } from './components/pending-orders/pending-orders.component';
import { OrdersByDateComponent } from './components/orders-by-date/orders-by-date.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { CookieService } from 'ngx-cookie-service';
import { RestInterceptor } from './_helpers/rest.interceptor';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { AllProductsComponent } from './components/admin-dashboard/all-products/all-products.component';
import { ProductsComponent } from './components/home/products/products.component';
import { CategoryProductsComponent } from './components/home/category-products/category-products.component';
import { CallToActionComponent } from './components/home/call-to-action/call-to-action.component';

// const config = new AuthServiceConfig([
//   {
//     id: GoogleLoginProvider.PROVIDER_ID,
//     provider: new GoogleLoginProvider('799705726167-vn6184fsovmps0kpbg5c7jabv15r3ias.apps.googleusercontent.com')
//   }

// ]);
// export function provideConfig() {
//   return config;
// }

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ProductComponent,
    ThankyouComponent,
    CartComponent,
    CheckoutComponent,
    UniqueFilterPipe,
    BdCurrencyPipe,
    CategoryComponent,
    UserComponent,
    LoginComponent,
    RegisterComponent,
    PasswordPatternDirective,
    HomeLayoutComponent,
    AdminLayoutComponent,
    AdminDashboardComponent,
    AdminHeaderComponent,
    AdminSidebarComponent,
    AdminFooterComponent,
    AdminSettingComponent,
    CreateProductComponent,
    GenerateProductComponent,
    ProductsByCategoryComponent,
    AllOrdersComponent,
    OrderByIdComponent,
    PendingOrdersComponent,
    OrdersByDateComponent,
    AllUsersComponent,
    CreateUserComponent,
    AllProductsComponent,
    ProductsComponent,
    CategoryProductsComponent,
    CallToActionComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    FormsModule,
    SocialLoginModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '682568102359-op611k59kdpleab7bvitpjries242orn.apps.googleusercontent.com'
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('clientId'),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ToastrInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RestInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
