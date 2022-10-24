import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Clothes } from '../model/clothes';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  isPriceVisible:boolean = true;
  isGenderVisible:boolean = true;
  isTypeVisible:boolean = true;
  isSizeVisible:boolean = true;

  isCheckedPrice1 = false;
  isCheckedPrice2 = false;
  isCheckedPrice3 = false;
  isCheckedPrice4 = false;
  isCheckedPrice5 = false;
  isCheckedPrice6 = false;

  isCheckedFemale = false;
  isCheckedMale = false;

  isCheckedShirt = false;
  isCheckedTshirt = false;
  isCheckedCoat = false;
  isCheckedTrousers = false;
  isCheckedSkirt = false;

  isCheckedSizeXS = false;
  isCheckedSizeS = false;
  isCheckedSizeM = false;
  isCheckedSizeL = false;
  isCheckedSizeXL = false;

  @Output() //ZS
  checkedChanged: EventEmitter<string> = new EventEmitter<string>(); //ZS

  constructor() { }

  ngOnInit(): void {
  }

  onChange(event: any, id: any){
    if(event === "true"){
      localStorage.setItem(id, event);
    }else{
      localStorage.removeItem(id);
    }

    this.checkedChanged.emit("true");
  }

  isPriceHidden(){
    this.isPriceVisible = !this.isPriceVisible;
  }

  isGenderHidden(){
    this.isGenderVisible = !this.isGenderVisible;
  }

  isTypeHidden(){
    this.isTypeVisible = !this.isTypeVisible
  }

  isSizeHidden(){
    this.isSizeVisible = !this.isSizeVisible;
  }

}
