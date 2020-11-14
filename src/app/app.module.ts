import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {StoreComponent} from './store/store.component';
import {UsernameComponent} from './username/username.component';
import {NavbarComponent} from './navbar/navbar.component';
import {RouterModule} from '@angular/router';
import {AngularFireModule} from "@angular/fire";
import {AngularFirestoreModule} from "@angular/fire/firestore";
import {AngularFireAuthModule} from "@angular/fire/auth";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {environment} from "../environments/environment";
import {ProductsComponent} from './products/products.component';
import {ShoppingCartComponent} from './shopping-cart/shopping-cart.component';
import {CheckOutComponent} from './check-out/check-out.component';
import {OrderSuccessComponent} from './order-success/order-success.component';
import {MyOrdersComponent} from './my-orders/my-orders.component';
import {AdminProductsComponent} from './admin/admin-products/admin-products.component';
import {AdminOrdersComponent} from './admin/admin-orders/admin-orders.component';
import {LoginComponent} from './login/login.component';
import {AuthService} from "./auth.service";
import {AuthGuard} from "./auth-guard.service";
import {UserService} from "./user.service";
import {AdminAuthGuard} from "./admin-auth-guard.service";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProductTableComponent } from './product-table/product-table.component';
import { ProductFormComponent } from './admin/product-form/product-form.component';
import {CategoryService} from "./category.service";
import {FormsModule} from "@angular/forms";
import {ProductService} from "./product.service";
import { CustomFormsModule } from 'ng2-validation';
import { ProductFilterComponent } from './products/product-filter/product-filter.component';
import { ProductCardComponent } from './product-card/product-card.component';
import {ShoppingCartService} from "./shopping-cart.service";
import { ProductQuantityComponent } from './product-quantity/product-quantity.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StoreComponent,
    UsernameComponent,
    NavbarComponent,
    ProductsComponent,
    ShoppingCartComponent,
    CheckOutComponent,
    OrderSuccessComponent,
    MyOrdersComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    LoginComponent,
    ProductTableComponent,
    ProductFormComponent,
    ProductFilterComponent,
    ProductCardComponent,
    ProductQuantityComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.config),
    AngularFirestoreModule,
    AngularFireAuthModule,
    CustomFormsModule,
    RouterModule.forRoot([
      {
        path: '', component: ProductsComponent
      },
      {
        path: 'products', component: ProductsComponent
      },
      {
        path: 'product-table', component: ProductTableComponent
      },
      {
        path: 'login', component: LoginComponent
      },
      {
        path: 'shopping-cart', component: ShoppingCartComponent
      },
      {
        path: 'check-out', component: CheckOutComponent, canActivate: [AuthGuard]
      },
      {
        path: 'order-success', component: OrderSuccessComponent, canActivate: [AuthGuard]
      },

      {
        path: 'my/orders', component: MyOrdersComponent, canActivate: [AuthGuard]
      },
      {
        path: 'admin/products/new', component: ProductFormComponent, canActivate: [AuthGuard, AdminAuthGuard]
      },
      {
        path: 'admin/products/:id', component: ProductFormComponent, canActivate: [AuthGuard, AdminAuthGuard]
      },
      {
        path: 'admin/products', component: AdminProductsComponent, canActivate: [AuthGuard, AdminAuthGuard]
      },
      {
        path: 'admin/orders', component: AdminOrdersComponent, canActivate: [AuthGuard, AdminAuthGuard]
      },

      {
        path: '**', component: HomeComponent
      }
    ]),
    NgbModule,
    NgxDatatableModule,
    FormsModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    AdminAuthGuard,
    UserService,
    CategoryService,
    ProductService,
    ShoppingCartService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
