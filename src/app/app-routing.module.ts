import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { WebshopComponent } from './webshop/webshop.component';
import { BuyItemComponent } from './buy-item/buy-item.component';
import { CartComponent } from './cart/cart.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { AuthGuard, IsSignedInGuard } from './services/auth.guard';
import { RoleGuard } from './services/role.guard';
import { UsersComponent } from './users/users.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'home', component: HomeComponent},
  { path: 'webshop', component: WebshopComponent, canActivate:[AuthGuard]},
  { path: 'buy-item', component: BuyItemComponent, canActivate:[AuthGuard]},
  { path: 'cart', component: CartComponent, canActivate:[AuthGuard]},
  { path: 'administrator', component: AdministratorComponent, canActivate:[AuthGuard, RoleGuard]},
  { path: 'users', component: UsersComponent, canActivate:[AuthGuard, RoleGuard]},
  { path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
