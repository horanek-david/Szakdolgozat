import { Component, OnInit } from '@angular/core';
import { Clothes } from '../model/clothes';

import { JwtHelperService } from '@auth0/angular-jwt';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  helper = new JwtHelperService();
  clothes: any = [];
  cloth = new Clothes();
  p:number = 1;
  isVisibleSucces = false;

  constructor(
    private appService: AppService,
  ) { }

  ngOnInit(): void {
    this.getClothes();
  }

  getClothes(){
    const token = localStorage.getItem("token");
    const decodedToken = this.helper.decodeToken(String(token));
    var id = decodedToken.id;

    this.appService.getCart(id).subscribe((data)=>{
      this.clothes = data;
    })
  }

  onDeleteCartCloth(id: any){
    this.appService.deleteCartCloth(id).subscribe(()=>{
      this.ngOnInit();
    });
  }

  onBuyClothes(){
    this.appService.buyClothes(this.clothes).subscribe((data) => {
      var msg = data;
      if(msg){
        this.isVisibleSucces = true;
      }
    })
  }

  onSucces(){
    this.isVisibleSucces = false;
    this.ngOnInit();
  }

}
