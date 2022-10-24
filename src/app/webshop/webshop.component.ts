import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { Clothes } from '../model/clothes';
import { Filter } from '../model/filter';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-webshop',
  templateUrl: './webshop.component.html',
  styleUrls: ['./webshop.component.css']
})
export class WebshopComponent implements OnInit {
  clothes: any = [];
  cloth = new Clothes();
  cloth2 = new Clothes();
  filter = new Filter();
  p:number = 1;
  searchText: string = "";
  isChecked:string = "";
  isAdministratorVisible:boolean = false;
  noSuchACloth:boolean = false;

  helper = new JwtHelperService();
  


  constructor(
    private appService: AppService,
    private router: Router,
  ) {
    
  }

  ngOnInit(): void {
    this.getFilteredClothes();
    this.canAcces();
  }

  canAcces(){
    const token = localStorage.getItem("token");
    const decodedToken = this.helper.decodeToken(String(token));

    if(decodedToken.role === "admin"){
      this.isAdministratorVisible = true;
    }else{
      this.isAdministratorVisible = false;
    }
  }

  onSearchTextEntered(searchValue: string){
    this.searchText = searchValue;
    this.ngOnInit();
  }

  onCheckedChanged(event: any){
    this.ngOnInit();
  }


  seeItem(cloth: Clothes){
    localStorage.setItem('clothid', cloth._id);
    this.router.navigate(['/buy-item']);
  }

  logOut(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getFilteredClothes(){
    this.isFiltered();
    this.appService.getFilterClothes(this.filter).subscribe((data)=>{
      this.clothes = data;
      if(this.clothes.length === 0){
        this.noSuchACloth = true;
      }else{
        this.noSuchACloth = false;
      }
    })
  }

  isFiltered(){
    this.filter = new Filter();
    this.filter.search = this.searchText;

    for( var key in localStorage){
      if(key === "price1"){
        this.filter.price1 = true;
      }
      if(key === "price2"){
        this.filter.price2 = true;
      }
      if(key === "price3"){
        this.filter.price3 = true;
      }
      if(key === "price4"){
        this.filter.price4 = true;
      }
      if(key === "price5"){
        this.filter.price5 = true;
      }
      if(key === "price6"){
        this.filter.price6 = true;
      }
      if(key === "male"){
        this.filter.male = true;
      }
      if(key === "female"){
        this.filter.female = true;
      }
      if(key === "shirt"){
        this.filter.shirt = true;
      }
      if(key === "tshirt"){
        this.filter.tshirt = true;
      }
      if(key === "coat"){
        this.filter.coat = true;
      }
      if(key === "trousers"){
        this.filter.trousers = true;
      }
      if(key === "skirt"){
        this.filter.skirt = true;
      }
      if(key === "sizexs"){
        this.filter.sizexs = true;
      }
      if(key === "sizes"){
        this.filter.sizes = true;
      }
      if(key === "sizem"){
        this.filter.sizem = true;
      }
      if(key === "sizel"){
        this.filter.sizel = true;
      }
      if(key === "sizexl"){
        this.filter.sizexl = true;
      }
    }
  }


}
