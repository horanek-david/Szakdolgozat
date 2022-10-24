import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cart } from '../model/cart';
import { Clothes } from '../model/clothes';
import { AppService } from '../services/app.service';

import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-buy-item',
  templateUrl: './buy-item.component.html',
  styleUrls: ['./buy-item.component.css']
})
export class BuyItemComponent implements OnInit {
  helper = new JwtHelperService();
  cloth = new Clothes();
  clothes: any = [];

  constructor(
    private appService: AppService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getItem();
  }

  getItem(){
    var id = localStorage.getItem('clothid');
    this.appService.getAllCloth().subscribe((data) => {
      this.clothes = data;

      for(this.cloth of this.clothes){
        if(this.cloth._id === id){
          this.cloth = this.cloth;
          return;
        }
      }
    })
  }

  goBack(){
    localStorage.removeItem('clothid');
    this.router.navigate(['/webshop']);
  }

  addToCart(cloth: Clothes){
    var cart = new Cart();

    const token = localStorage.getItem("token");
    const decodedToken = this.helper.decodeToken(String(token));

    cart.uid = decodedToken.id;
    cart.cid = cloth._id;
    cart.name = cloth.name;
    cart.price = cloth.price;
    cart.gender = cloth.gender;
    cart.color = cloth.color;
    cart.type = cloth.type;
    cart.size = cloth.size;
    cart.img = cloth.img;
    cart.status = 1;

    this.appService.addCart(cart).subscribe((data) => {
      localStorage.removeItem('clothid');
      this.router.navigate(['/webshop']);
    });
   
  }

}
