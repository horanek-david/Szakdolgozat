import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { WebshopComponent } from './webshop/webshop.component';
import { SearchComponent } from './search/search.component';
import { BuyItemComponent } from './buy-item/buy-item.component';
import { CartComponent } from './cart/cart.component';
import { FilterComponent } from './filter/filter.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { UsersComponent } from './users/users.component';

import { AuthInterceptor } from './services/auth.interceptor';
import { AuthGuard, IsSignedInGuard } from './services/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    WebshopComponent,
    SearchComponent,
    BuyItemComponent,
    CartComponent,
    FilterComponent,
    AdministratorComponent,
    UsersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,

    },
    AuthGuard,
    IsSignedInGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
